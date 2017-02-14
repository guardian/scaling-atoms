package db

import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException
import com.gu.atom.data.{DataStoreResult, DynamoCompositeKey, DynamoDataStore}
import com.gu.contentatom.thrift.AtomData.Media
import com.gu.contentatom.thrift.{Atom, AtomData, AtomType, ContentChangeDetails}
import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.contentatom.thrift.atom.explainer.{DisplayType, ExplainerAtom}
import com.gu.contentatom.thrift.atom.media.MediaAtom
import play.api.Logger
import cats.syntax.either._
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe._
import io.circe.syntax._
import util.AtomElementBuilders._

import com.gu.pandomainauth.model.User
import util.HelperFunctions._
import com.gu.atom
import models._
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe._
import io.circe.syntax._
import play.api.libs.json.JsLookupResult
import util.ClassToMap._
import util.MapToClass._
import util.Updater._

object AtomWorkshopDB {

  def buildKey(atomType: AtomType, id: String) = DynamoCompositeKey(atomType.name, Some(id))

  def transformAtomLibResult[T](result: DataStoreResult.DataStoreResult[T]): Either[AtomAPIError, T] = result match {
    case Left(e) => Left(AtomWorkshopDynamoDatastoreError(e.msg))
    case Right(r:T) => Right(r)
  }

  def updateNestedMap(map: Map[String, Any], path: List[String], value: JsLookupResult): Map[String, Any] = path match {
    case key :: Nil => map.updated(key, value)
    case key :: tail =>
      map(key) match {
        case None => map.updated(key, Some(updateNestedMap(Map(), tail, value)))
        case optionMap: Option[Map[String, Any]] => map.updated(key, Some(updateNestedMap(optionMap.get, tail, value)))
        case simpleMap: Map[String, Any] => map.updated(key, updateNestedMap(simpleMap, tail, value))
        case somethingElse => throw new UnsupportedOperationException(s"Unexpected type found during update: $somethingElse")
      }
  }

  def createAtom(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom], atomType: AtomType, user: User) = {
    val defaultAtom = buildDefaultAtom(atomType, user)
    Logger.info(s"Attempting to create atom of type ${atomType.name} with id ${defaultAtom.id}")
    try {
      val r = datastore.createAtom(buildKey(atomType, defaultAtom.id), defaultAtom)
      Logger.info(s"Successfully created atom of type ${atomType.name} with id ${defaultAtom.id}")
      getAtom(datastore, atomType, defaultAtom.id)
    } catch {
      case e: Exception => processException(e)
    }
  }

  def getAtom(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom], atomType: AtomType, id: String) = {
    transformAtomLibResult(datastore.getAtom(AtomWorkshopDB.buildKey(atomType, id)))
  }

  def updateAtom(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom], atomType: AtomType, user: User, currentVersion: Atom, newAtom: Atom): Either[AtomAPIError, Unit]  = {
    val updatedAtom = currentVersion.copy(
      contentChangeDetails = buildContentChangeDetails(user, Some(currentVersion.contentChangeDetails), updateLastModified = true),
      defaultHtml = buildDefaultHtml(atomType, currentVersion.data, Some(currentVersion.defaultHtml)),
      data = newAtom.data
    )
    try {
      val result = datastore.updateAtom(updatedAtom)
      Logger.info(s"Successfully updated atom of type ${atomType.name} with id ${currentVersion.id}")
      Right(transformAtomLibResult(result))
    } catch {
      case e: Exception => processException(e)
    }

  }

  def updateAtom(datastore: DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom], atomType: AtomType, user: User, id: String, field: String, value: JsLookupResult): Either[AtomAPIError, Unit] = {
    val updateResult = for {
      atom <- transformAtomLibResult(datastore.getAtom(AtomWorkshopDB.buildKey(atomType, id)))
      atomDataMap = atom.data.asInstanceOf[AtomData.Media].media.toMap
      updatedAtomData <- update(atomDataMap, field, value)
      newAtomData <- to[MediaAtom].from(updatedAtomData) match {
        case Some(data) => Right(data)
        case None =>
          Logger.error("Conversion to case class failed.")
          Left(ConvertingToClassError)
      }
      atomToSave: Atom = atom.copy(
        contentChangeDetails = buildContentChangeDetails(user, Some(atom.contentChangeDetails), updateLastModified = true),
        defaultHtml = buildDefaultHtml(atomType, Media(newAtomData), Some(atom.defaultHtml)),
        data = Media(newAtomData)
      )
    } yield datastore.updateAtom(atomToSave)
    updateResult.fold(err => Left(err), res => Right(transformAtomLibResult(res)))
  }
}