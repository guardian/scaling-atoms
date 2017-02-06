package controllers

import config.Config
import models._
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc.Controller
import cats.syntax.either._
import db.{AtomDataStores, AtomWorkshopDB}
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe._
import io.circe.syntax._
import io.circe.generic.semiauto._
import util.HelperFunctions._

class App(val wsClient: WSClient) extends Controller with PanDomainAuthActions {

  def index(placeholder: String) = AuthAction { req =>
    Logger.info(s"I am the ${Config.appName}")

    val clientConfig = ClientConfig(
      username = req.user.email
    )

    val jsFileName = "build/app.js"

    val jsLocation = sys.env.get("JS_ASSET_HOST").map(_ + jsFileName)
      .getOrElse(routes.Assets.versioned(jsFileName).toString)


    Ok(views.html.index("AtomMcAtomFace", jsLocation, clientConfig.asJson.noSpaces))
  }

  def getAtom(atomType: String, id: String, version: String) = AuthAction {
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        ds <- AtomDataStores.getDataStore(atomType, getVersion(version))
        atom <- AtomWorkshopDB.getAtom(ds, atomType, id)
      } yield atom
    }
  }

  def createAtom(atomType: String) = AuthAction { req =>
    APIResponse{
      for {
        atomType <- validateAtomType(atomType)
        ds <- AtomDataStores.getDataStore(atomType, Preview)
        atom <- AtomWorkshopDB.createAtom(ds, atomType, req.user)
      } yield atom
    }
  }

  def updateEntireAtom(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        payload <- extractRequestBody(req.body.asText)
        newAtom <- parseAtomJson(payload)
        datastore <- AtomDataStores.getDataStore(atomType, Preview)
        currentAtom <- AtomWorkshopDB.getAtom(datastore, atomType, id)
        result <- AtomWorkshopDB.updateAtom(datastore, atomType, req.user, currentAtom, newAtom)
      } yield AtomWorkshopAPIResponse(s"Update of atom of type $atomType with id $id successful.")
    }
  }

  def updateAtom(atomType: String, id: String, field: String) = AuthAction { implicit req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        ds <- AtomDataStores.getDataStore(atomType, Preview)
        value = req.body.asJson.get \ "value"
        atom <- AtomWorkshopDB.updateAtom(ds, atomType, id, field, value)
      } yield atom
    }
  }

}
