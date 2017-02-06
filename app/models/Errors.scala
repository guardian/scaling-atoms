package models

sealed abstract class AtomAPIError(val msg: String)

case object InvalidAtomTypeError extends AtomAPIError("Atom type not valid - did you make a typo? Correct examples: 'explainer', 'cta', 'media")
case object UnsupportedAtomTypeError extends AtomAPIError("Atom type not supported. Currently supported types: unknown")
case class AmazonDynamoError(message: String) extends AtomAPIError(s"Error thrown by Dynamo: $message")
case class CreateAtomDynamoError(atomJson: String, message: String) extends AtomAPIError(s"Error thrown by Dynamo when attempting to create atom. JSON of atom: $atomJson, error message: $message")
case class UpdateAtomDynamoError(message: String) extends AtomAPIError(s"Error thrown by Dynamo when attempting to update atom. Error message: $message")
case class AtomWorkshopDynamoDatastoreError(message: String) extends AtomAPIError(message)
case class AtomJsonParsingError(message: String) extends AtomAPIError(s"Failed to parse Json string with error: $message")
case class AtomThriftDeserialisingError(message: String) extends AtomAPIError(s"Failed to deserialise JSON into thrift with error: $message")
case object UnexpectedExceptionError extends AtomAPIError("Atom workshop hit an exception it didn't expect. Please try again!")
case object BodyRequiredForUpdateError extends AtomAPIError("You must provide a JSON representation of the the new version of the atom you wish to update in the body of your request")

case class UnexpectedTypeFound(map: String) extends AtomAPIError(s"Unexpected type found during update: $map")
case class WrongTypeFound(found: String, expected: String) extends AtomAPIError(s"Wrong type found during update: found $found, expected $expected")
case object ConvertingToClassError extends AtomAPIError("An error occurred during converting the map to case classes. Most likely some of the types don't match.")
