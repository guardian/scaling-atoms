package models

import play.api.Logger
import io.circe._
import io.circe.syntax._
import play.api.mvc._
import io.circe.generic.semiauto._

case class AtomWorkshopAPIResponse(message: String, detail: Option[Map[String,String]])
object AtomWorkshopAPIResponse{
  implicit val atomWorkshopApiResponseEncoder: Encoder[AtomWorkshopAPIResponse] = deriveEncoder[AtomWorkshopAPIResponse]
}


object APIResponse extends Results {
  def apiErrorToResult(e: AtomAPIError) = {
    Logger.error(e.msg)
    val out_details = e match {
      case AtomThriftDeserialisingError(msg,details)=>Some(details)
      case _=>None
    }
    InternalServerError(AtomWorkshopAPIResponse(e.msg,out_details).asJson.noSpaces)
  }

  def apply[T](result: Either[AtomAPIError, T])(implicit encoder: Encoder[T]): Result = {
    val res = result.fold(apiErrorToResult, r => Ok(r.asJson.noSpaces))
    res.as("text/json")
  }
}