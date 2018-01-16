package controllers

import config.Config
import play.api.libs.ws.{WSAuthScheme, WSClient}
import play.api.mvc.Controller
import play.api.libs.concurrent.Execution.Implicits._

class Support(val wsClient: WSClient) extends Controller with PanDomainAuthActions {

  def previewCapiProxy(path: String) = APIAuthAction.async { request =>

    val authCookieName = "gutoolsAuth-assym"
    val cookie = request.cookies.get(authCookieName).fold("")(_.value)

    val capiPreviewUser = Config.capiUsername
    val capiPreviewPassword = Config.capiPassword
    val capiUrl = Config.capiPreviewUrl
    val pandaPreviewUrl = Config.capiPandaPreviewUrl

    val url = s"$pandaPreviewUrl/$path?${request.rawQueryString}"

    val req = wsClient
      .url(url)
      .withHeaders("Cookie" -> s"$authCookieName=$cookie")
      .get()

    req.map(response => response.status match {
      case 200 => Ok(response.json)
      case _ => BadGateway(s"CAPI returned error code ${response.status}")
    })
  }
}
