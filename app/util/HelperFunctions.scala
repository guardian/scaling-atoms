package util

import com.gu.contentatom.thrift._
import com.gu.pandomainauth.model.{User => PandaUser}
import models._
import org.joda.time.DateTime
import io.circe.{DecodingFailure, ParsingFailure, parser}
import cats.syntax.either._
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException
import play.api.Logger
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe.syntax._
import io.circe._
import io.circe.parser.decode
import play.api.libs.json.JsLookupResult
import cats.syntax.either._

object HelperFunctions {
  def getVersion(version: String): Version = version match {
    case "preview" => Preview
    case "live" => Live
  }

  def validateAtomType(atomType: String): Either[AtomAPIError, AtomType] = {
    val t = AtomType.valueOf(atomType)
    Either.cond(t.isDefined, t.get, InvalidAtomTypeError)
  }

  def processException(exception: Exception) = {
    val atomApiError = exception match {
      case e: ParsingFailure => AtomJsonParsingError(e.message)
      case e: DecodingFailure => AtomThriftDeserialisingError(e.message)
      case e: AmazonDynamoDBException => AmazonDynamoError(e.getMessage)
      case _ => UnexpectedExceptionError
    }
    Logger.error(atomApiError.msg, exception)
    Left(atomApiError)
  }

  def extractRequestBody(body: Option[String]): Either[AtomAPIError, String]= {
    Either.cond(body.isDefined, body.get, BodyRequiredForUpdateError)
  }

  def parseAtomJson(atomJson: String): Either[AtomAPIError, Atom] = {
    Logger.info(s"Parsing atom json: ${atomJson}")
    val parsingResult = for {
      parsedAtom <- parser.parse(atomJson)
      decodedAtom <- parsedAtom.as[Atom]
    } yield {
      decodedAtom
    }
    parsingResult.fold(processException, a => Right(a))
  }
}

object Updater {
  def update(map: Map[String, Any], path: String, value: JsLookupResult): Either[AtomAPIError, Map[String, Any]] = for {
    updatedMap <- updateNestedMap(map, path.split('.').toList, value.as[String])
  } yield updatedMap

  private def updateNestedMap[T](map: Map[String, Any], path: List[String], value: T): Either[AtomAPIError, Map[String, Any]] = path match {
    case key :: Nil =>
      if(value.getClass != map(key).getClass) {
        Logger.error("Types not matching when trying to update.")
        Left(WrongTypeFound(found = value.getClass.getCanonicalName, expected = map(key).getClass.getCanonicalName))
      }
      else Right(map.updated(key, value))
    case key :: tail =>
      map(key) match {
        case None => Right(map.updated(key, Some(updateNestedMap(Map(), tail, value))))
        case optionMap: Option[Map[String, Any]] => Right(map.updated(key, Some(updateNestedMap(optionMap.get, tail, value))))
        case simpleMap: Map[String, Any] => Right(map.updated(key, updateNestedMap(simpleMap, tail, value)))
        case somethingElse =>
          Logger.error("Unexpected type found when trying to update the map.")
          Left(UnexpectedTypeFound(somethingElse.toString))
      }
  }
}