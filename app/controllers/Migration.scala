package controllers
// ------------------------------------------------------------
import cats.syntax.either._
import config.Config
import db.AtomDataStores._
import db.AtomWorkshopDBAPI
import io.circe._
import io.circe.syntax._
import io.circe.generic.auto._
import play.api.libs.concurrent.Execution.Implicits._
import models.CreateAtomFields
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.mvc.{ActionBuilder, Controller, Request, Result}

import services.AtomPublishers._
import util.AtomUpdateOperations._
import util.AtomElementBuilders

import com.gu.contentapi.client.IAMSigner
import com.gu.contentapi.client.model.v1.AtomsResponse
import com.gu.contentatom.thrift.{AtomType, AtomData}
import com.gu.fezziwig.CirceScroogeMacros._
import com.gu.pandomainauth.model.{User => PandaUser}

import scala.concurrent.{Await, Future}
import scala.concurrent.duration.Duration
// ------------------------------------------------------------

class Migration(
  val wsClient: WSClient, 
  val atomWorkshopDB: AtomWorkshopDBAPI) 
  extends Controller with PanDomainAuthActions {

  
  // ------------------------------------------------------------
  // Public API
  def migrateExplainers() = AuthAction { req =>
    Await.result(migrate(req.user)(1), Duration.Inf)
    Ok("Done!")
  }

  // ------------------------------------------------------------
  // CAPI auth stuff
  private val signer = new IAMSigner(
    credentialsProvider = Config.capiPreviewCredentials,
    awsRegion = Config.region.getName
  )

  private def getHeaders(url: String): Seq[(String,String)] = 
    signer.addIAMHeaders(headers = Map.empty, url = url).toSeq

  private def queryCapi(pageno: Int): Future[AtomsResponse] = {
    val url = s"${Config.capiPreviewIAMUrl}/atoms?types=explainer&page=$pageno"
    wsClient
      .url(url)
      .withHeaders(getHeaders(url): _*)
      .get
      .flatMap(response => response.status match {
        case 200 => Future.successful(response.body.asJson)
        case _ => Future.failed(new Throwable(s"CAPI error response: ${response.status} / ${response.body}"))
      })
      .flatMap(_.as[AtomsResponse].fold(
        e => Future.failed(new Throwable(s"CAPI json error: ${e}")),
        Future.successful(_)
      ))
  }

  // ------------------------------------------------------------
  // Here's how it works:
  // - query CAPI for all live explainers
  // - insert each result in the DynamoDB preview and live stores
  private def migrate(user: PandaUser)(pageNo: Int): Future[Unit] =
    queryCapi(pageNo)
      .flatMap(insertIntoDynamo(user))
      .flatMap { totalPages: Int =>
        if (pageNo < totalPages)
          migrate(user)(pageNo + 1)
        else
          Future.successful(())
      }

  // Publish atoms in the atom workshop datastores
  private def insertIntoDynamo(user: PandaUser)(ar: AtomsResponse): Future[Int] = {
    for {
      result <- ar.results
    } yield {
      val atomFields = CreateAtomFields(
        id = Some(result.id),
        title = result.data match {
          case a: AtomData.Explainer => Some(a.explainer.title)
          case _ => None
        },
        defaultHtml = Some(result.defaultHtml),
        commissioningDesks = result.commissioningDesks
      )
      val atomToCreate = AtomElementBuilders.buildDefaultAtom(AtomType.Explainer, user, Some(atomFields))
      for {
        atom <- atomWorkshopDB.createAtom(previewDataStore, AtomType.Explainer, user, atomToCreate)
        updatedAtom <- atomWorkshopDB.publishAtom(publishedDataStore, user, updateTopLevelFields(atom, user, publish=true))
        _ <- atomWorkshopDB.updateAtom(previewDataStore, updatedAtom)
      } yield ()
    }
    
    Future.successful(ar.pages)
  }
}
