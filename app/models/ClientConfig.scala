package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._

case class AtomEditorUrls(explainer: String, media: String)
object AtomEditorUrls {
  implicit val atomEditorEncoder: Encoder[AtomEditorUrls] = deriveEncoder
  implicit val atomEditorDecoder: Decoder[AtomEditorUrls] = deriveDecoder
}

case class User(firstName: String, lastName: String, email: String)
object User {
  implicit val userEncoder: Encoder[User] = deriveEncoder
  implicit val userDecoder: Decoder[User] = deriveDecoder
}

case class ClientConfig(
                         user: User,
                         gridUrl: String,
                         atomEditorUrls: AtomEditorUrls,
                         composerUrl: String,
                         viewerUrl: String,
                         capiLiveUrl: String,
                         presenceEndpointURL: String
                       )

object ClientConfig {
  implicit val clientConfigEncoder: Encoder[ClientConfig] = deriveEncoder
  implicit val clientConfigDecoder: Decoder[ClientConfig] = deriveDecoder
}
