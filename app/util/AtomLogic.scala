package util

import com.gu.atom.data.DynamoCompositeKey
import com.gu.contentatom.thrift.{Atom, AtomType}
import com.gu.pandomainauth.model.User
import io.circe.{DecodingFailure, ParsingFailure, parser}
import cats.syntax.either._
import com.amazonaws.services.dynamodbv2.model.AmazonDynamoDBException
import play.api.Logger
import com.gu.fezziwig.CirceScroogeMacros._
import db.AtomDataStores
import io.circe.syntax._
import io.circe._
import io.circe.parser.decode
import io.circe.generic.auto._
import io.circe.generic.semiauto._
import models._
import util.AtomElementBuilders._
import cats.data.{NonEmptyList, Validated}


object AtomLogic {

  def buildKey(atomType: AtomType, id: String) = DynamoCompositeKey(atomType.name, Some(id))

  def getVersion(version: String): Version = version match {
    case "preview" => Preview
    case "live" => Live
  }

  def validateAtomType(atomType: String): Either[AtomAPIError, AtomType] = {
    val t = AtomType.valueOf(atomType)
    Either.cond(t.isDefined, t.get, InvalidAtomTypeError)
  }

  def checkAtomCanBeDeletedFromPreview(responseFromLiveDatastore:Either[AtomAPIError, Atom]): Either[AtomAPIError, String] =
    responseFromLiveDatastore.fold(_ => Right("Atom does not exist on live"), _ => Left(DeleteAtomFromPreviewError))

  def processException(exception: Exception): Either[AtomAPIError, Nothing] = {
    val atomApiError = exception match {
      case e: ParsingFailure => AtomJsonParsingError(e.message)
      case e: AmazonDynamoDBException => AmazonDynamoError(e.getMessage)
      case _ => UnexpectedExceptionError
    }
    Logger.error(atomApiError.msg, exception)
    Left(atomApiError)
  }

  def processExceptionList(errorList:NonEmptyList[DecodingFailure]) = {
    val niceErrorList:Map[String,String] = errorList.toList.map(error=>{
      val errorPath = error.history.reverse.foldLeft("") { (accum:String, history:CursorOp)=>history match {
        case CursorOp.DownField(f)=>accum +  f + "."
        case _=>accum + "." + history.toString
      }

      }
      val xtractor = "Missing field: (\\S+)$".r
      val fieldname = xtractor.findAllMatchIn(error.message).toList.head.group(1)

      //s"""{"$fieldname$errorPath":"${error.message}"}"""
      s"$errorPath$fieldname" -> error.message
    })(collection.breakOut)

    AtomThriftDeserialisingError(s"Unable to process json into atom", niceErrorList)
  }

  def extractRequestBody(body: Option[String]): Either[AtomAPIError, String]= {
    Either.cond(body.isDefined, body.get, BodyRequiredForUpdateError)
  }

  def extractCreateAtomFields(body: Option[String]): Either[AtomAPIError, Option[CreateAtomFields]] = {
    body.map { body =>
      for {
        json <- Parser.stringToJson(body)
        createAtomFields <- json.as[CreateAtomFields].fold(processException, m => Right(m))
      } yield Some(createAtomFields)
    }.getOrElse(Right(None))
  }

  def updateTakenDownChangeRecord(atom: Atom, user: User): Atom =
    atom.copy(contentChangeDetails = buildContentChangeDetails(user, Some(atom.contentChangeDetails), updateTakenDown = true))
}

object Parser {
  import AtomLogic._

  def stringToAtom(atomString: String): Either[AtomAPIError, Atom] = {
    Logger.info(s"Parsing atom json: $atomString")
    for {
      json <- stringToJson(atomString)
      atom <- jsonToAtom(json)
    } yield atom
  }

  def jsonToAtom(json: Json): Either[AtomAPIError, Atom] = {
    Logger.info(s"Parsing json: $json")
    val decoder = Decoder[Atom]
    decoder.accumulating(json.hcursor) match {
      case Validated.Valid(atom)=>Right(atom)
      case Validated.Invalid(errorList)=>Left(processExceptionList(errorList))
    }
  }

  def stringToJson(atomJson: String): Either[AtomAPIError, Json] = {
    Logger.info(s"Parsing body to json: $atomJson")
    val parsingResult = for {
      parsedJson <- parser.parse(atomJson)
    } yield parsedJson
    parsingResult.fold(processException, a => Right(a))
  }
}