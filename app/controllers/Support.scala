package controllers

import java.net.URI

import com.gu.contentapi.client.IAMSigner
import config.Config
import play.api.libs.ws.WSClient
import play.api.mvc.Controller
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Logger

class Support(val wsClient: WSClient) extends Controller with PanDomainAuthActions {

  private val signer = new IAMSigner(
    credentialsProvider = Config.capiPreviewCredentials,
    awsRegion = Config.region.getName
  )

  private def getHeaders(url: String): Seq[(String,String)] = signer.addIAMHeaders(headers = Map.empty, uri = URI.create(url)).toSeq

  def previewCapiProxy(path: String) = APIAuthAction.async { request =>
    val capiUrl = Config.capiPreviewIAMUrl

    val url = s"$capiUrl/$path?${request.rawQueryString}"

    val req = wsClient
      .url(url)
      .withHeaders(getHeaders(url): _*)
      .get()

    req.map(response => response.status match {
      case 200 => Ok(response.json)
      case _ =>
        Logger.warn(s"CAPI error response: ${response.status} / ${response.body}")
        BadGateway(s"CAPI returned error code ${response.status}")
    })
  }
}
