package controllers

import com.gu.contentapi.client.IAMSigner
import config.Config
import play.api.libs.ws.WSClient
import play.api.mvc.Controller
import play.api.libs.concurrent.Execution.Implicits._

class Support(val wsClient: WSClient) extends Controller with PanDomainAuthActions {

  private val signer = new IAMSigner(
    credentials = Config.capiPreviewCredentials.getCredentials,
    awsRegion = Config.region.getName
  )

  private def getHeaders(url: String): Seq[(String,String)] = signer.addIAMHeaders(headers = Map.empty, url = url).toSeq

  def previewCapiProxy(path: String) = APIAuthAction.async { request =>
    val capiUrl = Config.capiPreviewIAMUrl

    val url = s"$capiUrl/$path?${request.rawQueryString}"

    val req = wsClient
      .url(url)
      .withHeaders(getHeaders(url): _*)
      .get()

    req.map(response => response.status match {
      case 200 => Ok(response.json)
      case _ => BadGateway(s"CAPI returned error code ${response.status}")
    })
  }
}
