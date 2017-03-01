import config.LogConfig
import play.api._
import play.api.ApplicationLoader.Context
import play.api.libs.ws.ahc.AhcWSComponents
import router.Routes
import db.AtomWorkshopDB

class AppComponents(context: Context)
  extends BuiltInComponentsFromContext(context) with AhcWSComponents {

  val logger = new LogConfig

  lazy val router = new Routes(httpErrorHandler, appController, healthcheckController, loginController, assets, supportController)
  lazy val assets = new controllers.Assets(httpErrorHandler)
  lazy val appController = new controllers.App(wsClient, atomWorkshopDB)
  lazy val loginController = new controllers.Login(wsClient)
  lazy val healthcheckController = new controllers.Healthcheck()
  lazy val supportController = new controllers.Support(wsClient)

  lazy val atomWorkshopDB = new AtomWorkshopDB()
}


