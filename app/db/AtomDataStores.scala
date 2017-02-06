package db

import com.gu.atom.data._
import com.gu.contentatom.thrift._
import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.contentatom.thrift.atom.explainer.ExplainerAtom
import com.gu.contentatom.thrift.atom.media.MediaAtom
import com.gu.scanamo.DynamoFormat
import com.gu.scanamo.scrooge.ScroogeDynamoFormat._
import config.Config
import cats.syntax.either._
import models.{Live, Preview, UnsupportedAtomTypeError, Version}

import scala.reflect.ClassTag


object AtomDataStores {

  val explainerDynamoFormats = new AtomDynamoFormats[ExplainerAtom] {
    def fromAtomData: PartialFunction[AtomData, ExplainerAtom] = { case AtomData.Explainer(data) => data }
    def toAtomData(data: ExplainerAtom): AtomData = AtomData.Explainer(data)
  }

  val ctaDynamoFormats = new AtomDynamoFormats[CTAAtom] {
    def fromAtomData: PartialFunction[AtomData, CTAAtom] = { case AtomData.Cta(data) => data }
    def toAtomData(data: CTAAtom): AtomData = AtomData.Cta(data)
  }

  val mediaDynamoFormats = new AtomDynamoFormats[MediaAtom] {
    def fromAtomData: PartialFunction[AtomData, MediaAtom] = { case AtomData.Media(data) => data }
    def toAtomData(data: MediaAtom): AtomData = AtomData.Media(data)
  }

  def getDataStores[T: ClassTag: DynamoFormat](dynamoFormats: AtomDynamoFormats[T]): Map[Version, DynamoDataStore[T]] = {
    Map(Preview -> new PreviewDynamoDataStore[T](Config.dynamoDB, Config.previewDynamoTableName) {
      def fromAtomData = dynamoFormats.fromAtomData
      def toAtomData(data: T) = dynamoFormats.toAtomData(data)
    },
      Live -> new PublishedDynamoDataStore[T](Config.dynamoDB, Config.publishedDynamoTableName) {
        def fromAtomData = dynamoFormats.fromAtomData
        def toAtomData(data: T) = dynamoFormats.toAtomData(data)
      })
  }

  val dataStores: Map[AtomType, Map[Version, DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom]]] = Map(
    AtomType.Explainer -> getDataStores[ExplainerAtom](explainerDynamoFormats),
    AtomType.Cta -> getDataStores[CTAAtom](ctaDynamoFormats),
    AtomType.Media -> getDataStores[MediaAtom](mediaDynamoFormats)
  )

  def getDataStore(atomType: AtomType, version: Version): Either[UnsupportedAtomTypeError.type, DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom]] = {
    val store = for {
      atomDataStores <- AtomDataStores.dataStores.get(atomType)
      atomDataStore <- atomDataStores.get(version)
    } yield atomDataStore

    Either.cond(store.isDefined, store.get, UnsupportedAtomTypeError)
  }
}
