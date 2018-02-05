package controllers
// ------------------------------------------------------------
import java.net.URI

import cats.syntax.either._
import config.Config
import db.AtomDataStores._
import db.AtomWorkshopDBAPI
import play.api.libs.concurrent.Execution.Implicits._
import models.CreateAtomFields
import play.api.Logger
import play.api.libs.ws.WSClient
import play.api.libs.json.{util => _, _}
import play.api.mvc.{ActionBuilder, Controller, Request, Result}
import services.AtomPublishers._
import util.AtomUpdateOperations._
import util.AtomElementBuilders
import com.gu.contentapi.client.IAMSigner
import com.gu.contentapi.client.model.v1.AtomsResponse
import com.gu.contentatom.thrift.{AtomData, AtomType}
import com.gu.contentatom.thrift.atom.explainer._
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
    signer.addIAMHeaders(headers = Map.empty, uri = URI.create(url)).toSeq

  private def queryCapi(pageno: Int): Future[JsValue] = {
    Logger.info(s"Querying page ${pageno}")
    val url = s"${Config.capiPreviewIAMUrl}/atoms?types=explainer&page=$pageno"
    wsClient
      .url(url)
      .withHeaders(getHeaders(url): _*)
      .get
      .flatMap(response => response.status match {
        case 200 => Future.successful(response.json)
        case _ => {
          Logger.error(s"CAPI error response: ${response.status} / ${response.body}")
          Future.failed(new Throwable(s"CAPI error response: ${response.status} / ${response.body}"))
        }
      })
  }

  // ------------------------------------------------------------
  // Here's how it works:
  // - query CAPI for all live explainers
  // - insert each result in the DynamoDB preview and live stores
  private def migrate(user: PandaUser)(pageNo: Int): Future[Unit] =
    queryCapi(pageNo)
      .flatMap(insertIntoDynamo(user))
      .flatMap { totalPages: Int =>
        Logger.info(s"Processed $pageNo out of $totalPages pages")
        if (pageNo < totalPages)
          migrate(user)(pageNo + 1)
        else
          Future.successful(())
      }

  // Publish atoms in the atom workshop datastores
  private def insertIntoDynamo(user: PandaUser)(resp: JsValue): Future[Int] = {
    (resp \ "response" \ "results").asOpt[Array[JsValue]].foreach { results =>
      Logger.info(s"We've got ${results.length} records to insert...")
      for {
        result <- results
      } yield {
        val atomFields = CreateAtomFields(
          id = (result \ "id").asOpt[String],
          title = (result \ "data" \ "explainer" \ "title").asOpt[String],
          defaultHtml = (result \ "defaultHtml").asOpt[String],
          commissioningDesks = (result \ "commissioningDesks").asOpt[List[String]].getOrElse(Nil)
        )
        val atomToCreate = AtomElementBuilders
          .buildDefaultAtom(AtomType.Explainer, user, Some(atomFields))
          .copy(data = AtomData.Explainer(ExplainerAtom(
            atomFields.title.getOrElse("-"), 
            (result \ "data" \ "explainer" \ "body").asOpt[String].getOrElse("-"), 
            DisplayType.Flat
          )))
        for {
          atom <- atomWorkshopDB.createAtom(previewDataStore, AtomType.Explainer, user, atomToCreate)
          updatedAtom <- atomWorkshopDB.publishAtom(publishedDataStore, user, updateTopLevelFields(atom, user, publish=true))
          _ <- atomWorkshopDB.updateAtom(previewDataStore, updatedAtom)
        } yield ()
      }
      Logger.info(s"... aaaand Done!")
    }

    Future.successful((resp \ "response" \ "pages").as[Int])
  }
}
