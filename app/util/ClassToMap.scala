package util

import com.gu.contentatom.thrift.atom.media._
import com.gu.contentatom.thrift.{ImageAssetDimensions, ImageAsset, Image}
import shapeless.labelled._
import shapeless._

object ClassToMap {
  // FROM CASE CLASS TO MAP (http://stackoverflow.com/a/31638390)
  trait ToMapRec[L <: HList] {
    def apply(l: L): Map[String, Any]
  }

  // Case for heads that don't have ToMapRec instances (hconsToMapRec1).
  // Note that we need to use a LowPriority trait to make sure that this instance is
  // prioritized properly with respect to hconsToMapRec0—if we didn't, the two would have
  // the same priority and we'd get errors about ambiguous instances.
  trait LowPriorityToMapRec {
    implicit def hconsToMapRecNode[K <: Symbol, V, T <: HList]
    (implicit
     wit: Witness.Aux[K],
     toMapRecTail: Lazy[ToMapRec[T]]
    ): ToMapRec[FieldType[K, V] :: T] = new ToMapRec[FieldType[K, V] :: T] {
      override def apply(l: FieldType[K, V] :: T): Map[String, Any] = {
        toMapRecTail.value(l.tail) + (wit.value.name -> l.head)
      }
    }
  }

  object ToMapRec extends LowPriorityToMapRec {
    implicit val hNilToMapRec: ToMapRec[HNil] = new ToMapRec[HNil] {
      override def apply(l: HNil): Map[String, Any] = Map.empty
    }

    //  Case where we know how to convert the tail of the record, and we know that
    //  the head is something that we can also recursively convert
    implicit def hconsToMapRecDefault[K <: Symbol, V, R <: HList, T <: HList]
    (implicit
     wit: Witness.Aux[K],
     gen: LabelledGeneric.Aux[V, R],
     toMapRecTail: Lazy[ToMapRec[T]],
     toMapRecHead: Lazy[ToMapRec[R]]
    ): ToMapRec[FieldType[K, V] :: T] = new ToMapRec[FieldType[K, V] :: T] {
      override def apply(l: FieldType[K, V] :: T): Map[String, Any] = {
        toMapRecTail.value(l.tail) + (wit.value.name -> toMapRecHead.value(gen.to(l.head)))
      }
    }

    implicit def hconsToMapRecOption[K <: Symbol, V, R <: HList, T <: HList]
    (implicit
     wit: Witness.Aux[K],
     gen: LabelledGeneric.Aux[V, R],
     toMapRecTail: Lazy[ToMapRec[T]],
     toMapRecHead: Lazy[ToMapRec[R]]
    ): ToMapRec[FieldType[K, Option[V]] :: T] = new ToMapRec[FieldType[K, Option[V]] :: T] {
      override def apply(l: FieldType[K, Option[V]] :: T): Map[String, Any] = {
        toMapRecTail.value(l.tail) + (wit.value.name -> l.head.map(value => toMapRecHead.value(gen.to(value))))
      }
    }

    implicit def hconsToMapRecSeq[K <: Symbol, V, R <: HList, T <: HList]
    (implicit
     wit: Witness.Aux[K],
     gen: LabelledGeneric.Aux[V, R],
     toMapRecTail: Lazy[ToMapRec[T]],
     toMapRecHead: Lazy[ToMapRec[R]]
    ): ToMapRec[FieldType[K, Seq[V]] :: T] = new ToMapRec[FieldType[K, Seq[V]] :: T] {
      override def apply(l: FieldType[K, Seq[V]] :: T): Map[String, Any] = {
        toMapRecTail.value(l.tail) + (wit.value.name -> l.head.map(value => toMapRecHead.value(gen.to(value))))
      }
    }
  }

  implicit class ToMapRecOps[A](val a: A) extends AnyVal {
    def toMap[L <: HList]
    (implicit
     gen: LabelledGeneric.Aux[A, L],
     toMapRec: Lazy[ToMapRec[L]]
    ): Map[String, Any] = toMapRec.value(gen.to(a))
  }

  implicit def mediaAtomLabelledGeneric[L <: HList](implicit gen: LabelledGeneric.Aux[MediaAtom.Immutable, L]): LabelledGeneric.Aux[MediaAtom, L] =
    anyLabelledGeneric[MediaAtom, MediaAtom.Immutable, L]
  implicit def assetLabelledGeneric[L <: HList](implicit gen: LabelledGeneric.Aux[Asset.Immutable, L]): LabelledGeneric.Aux[Asset, L] =
    anyLabelledGeneric[Asset, Asset.Immutable, L]
  implicit def metadataDatesLabelledGeneric[L <: HList](implicit gen: LabelledGeneric.Aux[Metadata.Immutable, L]): LabelledGeneric.Aux[Metadata, L] =
    anyLabelledGeneric[Metadata, Metadata.Immutable, L]
  implicit def imageLabelledGeneric[L <: HList](implicit gen: LabelledGeneric.Aux[Image.Immutable, L]): LabelledGeneric.Aux[Image, L] =
    anyLabelledGeneric[Image, Image.Immutable, L]
  implicit def flagsLabelledGeneric[L <: HList](implicit gen: LabelledGeneric.Aux[ImageAsset.Immutable, L]): LabelledGeneric.Aux[ImageAsset, L] =
    anyLabelledGeneric[ImageAsset, ImageAsset.Immutable, L]
  implicit def furLabelledGeneric[L <: HList](implicit gen: LabelledGeneric.Aux[ImageAssetDimensions.Immutable, L]): LabelledGeneric.Aux[ImageAssetDimensions, L] =
    anyLabelledGeneric[ImageAssetDimensions, ImageAssetDimensions.Immutable, L]

  def anyLabelledGeneric[A, I <: A, L <: HList](implicit gen: LabelledGeneric.Aux[I, L]): LabelledGeneric.Aux[A, L] =
    new LabelledGeneric[A] {
      override type Repr = L
      override def to(t: A): Repr = gen.to(t.asInstanceOf[I])
      override def from(r: Repr): A = gen.from(r)
    }
}
