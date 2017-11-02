package services

import com.amazonaws.auth.AWSCredentialsProvider
import com.gu.editorial.permissions.client._
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._
import scala.concurrent.Future

case class Permissions(deleteAtom: Boolean)
object Permissions {
  val app = "atom-maker"
  val deleteAtom = Permission("delete_atom", app, defaultVal = PermissionDenied)

  implicit val permissionsEncoder: Encoder[Permissions] = deriveEncoder
  implicit val permissionsDecoder: Decoder[Permissions] = deriveDecoder
}

class AtomWorkshopPermissionsProvider(stage: String, credsProvider: AWSCredentialsProvider) extends PermissionsProvider {
  import Permissions._

  val all = Seq(deleteAtom)
  val none = Permissions(deleteAtom = false)

  implicit def config = PermissionsConfig(
    app = "atom-workshop",
    all = Seq(deleteAtom),
    s3BucketPrefix = if(stage == "PROD") "PROD" else "CODE",
    awsCredentials = credsProvider
  )

  def getAll(email: String): Future[Permissions] = for {
    deleteAtom <- hasPermission(deleteAtom, email)
  } yield Permissions(deleteAtom)


  private def hasPermission(permission: Permission, email: String): Future[Boolean] = {
    get(permission)(PermissionsUser(email)).map {
      case PermissionGranted => true
      case _ => false
    }
  }
}
