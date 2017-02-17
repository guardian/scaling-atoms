package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._

case class ClientConfig(
                         username: String,
                         gridUrl: String
                       )

object ClientConfig {
  implicit val clientConfigEncoder: Encoder[ClientConfig] = deriveEncoder
  implicit val clientConfigDecoder: Decoder[ClientConfig] = deriveDecoder
}