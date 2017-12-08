package models

case class CreateAtomFields(title: Option[String], id: Option[String], commissioningDesks: Seq[String], defaultHtml: Option[String])