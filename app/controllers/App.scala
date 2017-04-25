package controllers

import cats.syntax.either._
import com.gu.contentatom.thrift.{Atom, AtomType, EventType}
import com.gu.fezziwig.CirceScroogeMacros._
import config.Config
import db._
import models._
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc.Controller
import services.AtomPublishers._
import util.AtomLogic._
import util.DraftLogic._
import util.AtomUpdateOperations._
import util.Parser._
import util.atomBuilders.{AtomElementBuilder, DraftElementBuilder}

// Required for Json parsing
import io.circe.generic.auto._
import io.circe.Json
import io.circe.syntax._

class App(
    val wsClient: WSClient,
    val atomWorkshopDraftDbAPI: AtomWorkshopDraftDbAPI,
    val atomWorkshopPreviewDbAPI: AtomWorkshopPreviewDbAPI,
    val atomWorkshopPublishedDbAPI: AtomWorkshopPublishedDbAPI) extends Controller with PanDomainAuthActions {

  def index(placeholder: String) = AuthAction { req =>
    Logger.info(s"I am the ${Config.appName}")
    val clientConfig = ClientConfig(
      user = User(req.user.firstName, req.user.lastName, req.user.email),
      gridUrl = Config.gridUrl,
      composerUrl = Config.composerUrl,
      viewerUrl = Config.viewerUrl,
      capiLiveUrl = Config.capiLiveUrl,
      targetingUrl = Config.targetingUrl,
      isEmbedded = req.queryString.get("embeddedMode").isDefined,
      embeddedMode = req.queryString.get("embeddedMode").map(_.head),
      atomEditorGutoolsDomain = Config.atomEditorGutoolsDomain,
      presenceEnabled = Config.presenceEnabled,
      presenceEndpointURL = Config.presenceEndpointURL
    )

    val jsFileName = "build/app.js"

    val jsLocation = sys.env.get("JS_ASSET_HOST").map(_ + jsFileName)
      .getOrElse(routes.Assets.versioned(jsFileName).toString)

    Ok(views.html.index("Atom Workshop", jsLocation, clientConfig.asJson.noSpaces))
  }

  def getDraft(draftType: String, id: String) = AuthAction {
    APIResponse{
      for {
        draftType <- validateDraftType(draftType)
        draft <- atomWorkshopDraftDbAPI.getDraft(draftType, id)
      } yield draft
    }
  }

  def getAtom(atomType: String, id: String, version: String) = AuthAction {
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        dbAPIVersion = getVersion(version)
        atom <- getAtomFromDatastore(atomType, id, dbAPIVersion)
      } yield atom
    }
  }

  private def getAtomFromDatastore(atomType: AtomType, id: String, version: Version): Either[AtomAPIError, Atom] = version match {
    case Preview => atomWorkshopPreviewDbAPI.getAtom(atomType, id)
    case Live => atomWorkshopPublishedDbAPI.getAtom(atomType, id)
    case Draft => Left(AtomWorkshopDynamoDatastoreError("Draft datastore does not contain atoms."))
  }

  def createDraft(draftType: String) = AuthAction {req =>
    APIResponse {
      for {
        draftType <- validateDraftType(draftType)
        createDraftFields <- extractCreateAtomFields(req.body.asJson.map(_.toString))
        draftToCreate = DraftElementBuilder.buildDraft(draftType, createDraftFields)
        draft <- atomWorkshopDraftDbAPI.createDraft(draftType, draftToCreate)
      } yield draft
    }
  }

  def createAtom(atomType: String) = AuthAction { req =>
    APIResponse{
      for {
        atomType <- validateAtomType(atomType)
        createAtomFields <- extractCreateAtomFields(req.body.asJson.map(_.toString))
        atomToCreate = AtomElementBuilder.buildDefaultAtom(atomType, req.user, createAtomFields)
        atom <- atomWorkshopPreviewDbAPI.createAtom(atomType, req.user, atomToCreate)
        _ <- sendKinesisEvent(atom, previewAtomPublisher, EventType.Update)
      } yield atom
    }
  }

  def publishAtom(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        currentDraftAtom <- atomWorkshopPreviewDbAPI.getAtom(atomType, id)
        updatedAtom <- atomWorkshopPublishedDbAPI.publishAtom(req.user, updateTopLevelFields(currentDraftAtom, req.user, publish=true))
        _ <- atomWorkshopPreviewDbAPI.updateAtom(updatedAtom)
        _ <- sendKinesisEvent(updatedAtom, liveAtomPublisher, EventType.Update)
        _ <- sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
      } yield updatedAtom
    }
  }

  def updateEntireAtom(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        payload <- extractRequestBody(req.body.asJson.map(_.toString))
        newAtom <- stringToAtom(payload)
        updatedAtom <- atomWorkshopPreviewDbAPI.updateAtom(updateTopLevelFields(newAtom, req.user))
        _ <- sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
      } yield updatedAtom
    }
  }

  def updateAtomByPath(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        payload <- extractRequestBody(req.body.asJson.map(_.toString))
        newJson <- stringToJson(payload)
        currentAtom <- atomWorkshopPreviewDbAPI.getAtom(atomType, id)
        newAtom <- updateAtomFromJson(currentAtom, newJson, req.user)
        updatedAtom <- atomWorkshopPreviewDbAPI.updateAtom(updateTopLevelFields(newAtom, req.user))
        _ <- sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
      } yield updatedAtom
    }
  }

  def deleteAtom(atomType: String, id: String) = AuthAction {
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        liveAtom = atomWorkshopPublishedDbAPI.getAtom(atomType, id)
        _ <- checkAtomCanBeDeletedFromPreview(liveAtom)
        result <- atomWorkshopPreviewDbAPI.deleteAtom(atomType, id)
        atom <- liveAtom
        _ <- sendKinesisEvent(atom, previewAtomPublisher, EventType.Takedown)
      } yield AtomWorkshopAPIResponse("Atom deleted from preview")
    }
  }

  def takedownAtom(atomType: String, id: String) = AuthAction { req =>
    APIResponse {
      for {
        atomType <- validateAtomType(atomType)
        atom <- atomWorkshopPublishedDbAPI.getAtom(atomType, id)
        updatedAtom <- atomWorkshopPreviewDbAPI.updateAtom(updateTakenDownChangeRecord(atom, req.user))
        result <- atomWorkshopPublishedDbAPI.deleteAtom(atomType, id)
        _ <- sendKinesisEvent(updatedAtom, liveAtomPublisher, EventType.Takedown)
        _ <- sendKinesisEvent(updatedAtom, previewAtomPublisher, EventType.Update)
      } yield updatedAtom
    }
  }

}
