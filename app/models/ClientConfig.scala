package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._

case class AtomEditorUrls(explainer: String, media: String)
object AtomEditorUrls {
  implicit val atomEditorEncoder: Encoder[AtomEditorUrls] = deriveEncoder
  implicit val atomEditorDecoder: Decoder[AtomEditorUrls] = deriveDecoder
}

case class ClientConfig(
                         username: String,
                         gridUrl: String,
                         atomEditorUrls: AtomEditorUrls,
                         composerUrl: String,
                         viewerUrl: String,
                         capiLiveUrl: String
                       )

object ClientConfig {
  implicit val clientConfigEncoder: Encoder[ClientConfig] = deriveEncoder
  implicit val clientConfigDecoder: Decoder[ClientConfig] = deriveDecoder
}
