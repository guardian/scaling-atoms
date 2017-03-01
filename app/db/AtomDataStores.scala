package db

import com.gu.atom.data._
import com.gu.contentatom.thrift._
import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.contentatom.thrift.atom.explainer.ExplainerAtom
import com.gu.contentatom.thrift.atom.media.MediaAtom
import com.gu.contentatom.thrift.atom.recipe.RecipeAtom
import com.gu.contentatom.thrift.atom.storyquestions.StoryQuestionsAtom
import com.gu.scanamo.DynamoFormat
import com.gu.scanamo.scrooge.ScroogeDynamoFormat._
import config.Config
import cats.syntax.either._
import models.{Live, Preview, UnsupportedAtomTypeError, Version, AtomAPIError}

import scala.reflect.ClassTag


object AtomDataStores {

  type AtomWorkshopDataStore = DynamoDataStore[_ >: ExplainerAtom with CTAAtom with MediaAtom with RecipeAtom with StoryQuestionsAtom]

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

  val recipeDynamoFormats = new AtomDynamoFormats[RecipeAtom] {
    def fromAtomData: PartialFunction[AtomData, RecipeAtom] = { case AtomData.Recipe(data) => data }
    def toAtomData(data: RecipeAtom): AtomData = AtomData.Recipe(data)
  }

  val storyQuestionsDynamoFormats = new AtomDynamoFormats[StoryQuestionsAtom] {
    def fromAtomData: PartialFunction[AtomData, StoryQuestionsAtom] = { case AtomData.Storyquestions(data) => data }
    def toAtomData(data: StoryQuestionsAtom): AtomData = AtomData.Storyquestions(data)
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

  val dataStores: Map[AtomType, Map[Version, AtomWorkshopDataStore]] = Map(
    AtomType.Explainer -> getDataStores[ExplainerAtom](explainerDynamoFormats),
    AtomType.Cta -> getDataStores[CTAAtom](ctaDynamoFormats),
    AtomType.Media -> getDataStores[MediaAtom](mediaDynamoFormats),
    AtomType.Recipe -> getDataStores[RecipeAtom](recipeDynamoFormats),
    AtomType.Storyquestions -> getDataStores[StoryQuestionsAtom](storyQuestionsDynamoFormats)
  )

  def getDataStore(atomType: AtomType, version: Version): Either[AtomAPIError, AtomWorkshopDataStore] = {
    val store = for {
      atomDataStores <- AtomDataStores.dataStores.get(atomType)
      atomDataStore <- atomDataStores.get(version)
    } yield atomDataStore

    Either.cond(store.isDefined, store.get, UnsupportedAtomTypeError)
  }
}
