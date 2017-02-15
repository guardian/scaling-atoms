package util

import shapeless.labelled._
import shapeless._

object MapToClass {
  // FROM MAP TO CASE CLASS (http://stackoverflow.com/a/31641779)
  trait FromMap[L <: HList] {
    def apply(map: Map[String, Any]): Option[L]
  }

  trait LowPriorityFromMap {
    implicit def hconsFromMap1[K <: Symbol, V, T <: HList]
    (implicit
     witness: Witness.Aux[K],
     typeable: Typeable[V],
     fromMapTail: Lazy[FromMap[T]]
    ): FromMap[FieldType[K, V] :: T] = new FromMap[FieldType[K, V] :: T] {
      def apply(map: Map[String, Any]): Option[FieldType[K, V] :: T] = for {
        value <- map.get(witness.value.name)
        head <- typeable.cast(value)
        tail <- fromMapTail.value(map)
      } yield field[K](head) :: tail
    }
  }

  object FromMap extends LowPriorityFromMap {
    implicit val hnilFromMap: FromMap[HNil] = new FromMap[HNil] {
      def apply(map: Map[String, Any]): Option[HNil] = Some(HNil)
    }

    implicit def hconsFromMap0[K <: Symbol, V, R <: HList, T <: HList]
    (implicit
     witness: Witness.Aux[K],
     gen: LabelledGeneric.Aux[V, R],
     fromMapH: Lazy[FromMap[R]],
     fromMapT: Lazy[FromMap[T]]
    ): FromMap[FieldType[K, V] :: T] = new FromMap[FieldType[K, V] :: T] {
      def apply(map: Map[String, Any]): Option[FieldType[K, V] :: T] = for {
        value <- map.get(witness.value.name)
        headMap <- Typeable[Map[String, Any]].cast(value)
        head <- fromMapH.value(headMap)
        tail <- fromMapT.value(map)
      } yield field[K](gen.from(head)) :: tail
    }

    implicit def hconsFromMapOption[K <: Symbol, V, R <: HList, T <: HList]
    (implicit
     witness: Witness.Aux[K],
     gen: LabelledGeneric.Aux[V, R],
     fromMapH: Lazy[FromMap[R]],
     fromMapT: Lazy[FromMap[T]]
    ): FromMap[FieldType[K, Option[V]] :: T] = new FromMap[FieldType[K, Option[V]] :: T] {
      def apply(map: Map[String, Any]): Option[FieldType[K, Option[V]] :: T] = {
        map(witness.value.name) match {
          case Some(v) =>
            for {
              headMap <- Typeable[Option[Map[String, Any]]].cast(Some(v))
              head <- headMap.map(fromMapH.value(_))
              tail <- fromMapT.value(map)
            } yield field[K](head.map(gen.from)) :: tail
          case None =>
            for {
              tail <- fromMapT.value(map)
            } yield field[K](None) :: tail
        }
      }
    }

    implicit def hconsFromMapSeq[K <: Symbol, V, R <: HList, T <: HList]
    (implicit
     witness: Witness.Aux[K],
     gen: LabelledGeneric.Aux[V, R],
     fromMapH: Lazy[FromMap[R]],
     fromMapT: Lazy[FromMap[T]]
    ): FromMap[FieldType[K, Seq[V]] :: T] = new FromMap[FieldType[K, Seq[V]] :: T] {
      def apply(map: Map[String, Any]): Option[FieldType[K, Seq[V]] :: T] = {
        map(witness.value.name) match {
          case list: Seq[_] if list.nonEmpty =>
            for {
              headMap <- Typeable[Seq[Map[String, Any]]].cast(list)
              head = headMap.map(elem => fromMapH.value(elem).get)
              tail <- fromMapT.value(map)
            } yield field[K](head.map(repr => gen.from(repr))) :: tail
          case _ =>
            for {
              tail <- fromMapT.value(map)
            } yield field[K](Seq()) :: tail
        }
      }
    }
  }

  class ConvertHelper[A] {
    def from[R <: HList](map: Map[String, Any])
                        (implicit
                         gen: LabelledGeneric.Aux[A, R],
                         fromMap: Lazy[FromMap[R]]): Option[A] = fromMap.value(map).map(gen.from)
  }

  def to[A]: ConvertHelper[A] = new ConvertHelper[A]
}
