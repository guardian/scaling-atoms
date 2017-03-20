package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._

case class User(firstName: String, lastName: String, email: String)
object User {
  implicit val userEncoder: Encoder[User] = deriveEncoder
  implicit val userDecoder: Decoder[User] = deriveDecoder
}

case class ClientConfig(
                         user: User,
                         gridUrl: String,
                         composerUrl: String,
                         viewerUrl: String,
                         capiLiveUrl: String,
                         targetingUrl: String,
                         isEmbedded: Boolean,
                         embeddedMode: Option[String],
                         atomEditorGutoolsDomain: String,
                         presenceEnabled: Boolean,
                         presenceEndpointURL: String
                       )

object ClientConfig {
  implicit val clientConfigEncoder: Encoder[ClientConfig] = deriveEncoder
  implicit val clientConfigDecoder: Decoder[ClientConfig] = deriveDecoder
}
