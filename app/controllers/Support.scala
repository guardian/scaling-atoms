package controllers

import config.Config
import play.api.libs.ws.{WSAuthScheme, WSClient}
import play.api.mvc.Controller
import play.api.libs.concurrent.Execution.Implicits._

class Support(val wsClient: WSClient) extends Controller with PanDomainAuthActions {

  def previewCapiProxy(path: String) = APIAuthAction.async { request =>

    val capiPreviewUser = Config.capiUsername
    val capiPreviewPassword = Config.capiPassword
    val capiUrl = Config.capiPreviewUrl

    val url = s"$capiUrl/$path?${request.rawQueryString}"

    val req = wsClient
      .url(url)
      .withAuth(capiPreviewUser, capiPreviewPassword, WSAuthScheme.BASIC)
      .get()

    req.map(response => response.status match {
      case 200 => Ok(response.json)
      case _ => BadGateway(s"CAPI returned error code ${response.status}")
    })
  }
}
