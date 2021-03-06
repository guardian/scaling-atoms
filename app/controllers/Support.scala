package controllers

import java.net.URI

import com.gu.contentapi.client.IAMSigner
import config.Config
import play.api.libs.ws.WSClient
import play.api.mvc.{ Controller, Result }
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Logger
import scala.concurrent.Future

class Support(val wsClient: WSClient) extends Controller with PanDomainAuthActions {

  private val signer = new IAMSigner(
    credentialsProvider = Config.capiPreviewCredentials,
    awsRegion = Config.region.getName
  )

  private def getHeaders(url: String): Seq[(String,String)] = signer.addIAMHeaders(headers = Map.empty, uri = URI.create(url)).toSeq

  def capiProxy(path: String) = APIAuthAction.async { request =>
    query(s"${Config.capiLiveUrl}/$path?api-key=${Config.capiApiKey}&${request.rawQueryString}", Seq.empty)
  }

  def previewCapiProxy(path: String) = APIAuthAction.async { request =>
    val url = s"${Config.capiPreviewIAMUrl}/$path?${request.rawQueryString}"
    query(url, getHeaders(url))
  }

  def query(url: String, headers: Seq[(String, String)]): Future[Result] = {
    val req = wsClient
      .url(url)
      .withHeaders(headers: _*)
      .get()

    req.map(response => response.status match {
      case 200 => Ok(response.json)
      case _ =>
        Logger.warn(s"CAPI error response: ${response.status} / ${response.body}")
        BadGateway(s"CAPI returned error code ${response.status}")
    })
  }
}
