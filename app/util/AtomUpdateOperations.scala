package util

import com.gu.contentatom.thrift.Atom
import AtomElementBuilders._
import com.gu.pandomainauth.model.User
import io.circe.Json
import com.gu.fezziwig.CirceScroogeMacros
import com.gu.fezziwig.CirceScroogeMacros._
import io.circe.syntax._
import models.AtomAPIError
import util.Parser._
import cats.syntax.either._

object AtomUpdateOperations {
  def updateTopLevelFields(atom: Atom, user: User, publish: Boolean = false): Atom =
    atom.copy(
      contentChangeDetails = buildContentChangeDetails(user, Some(atom.contentChangeDetails), updateLastModified = true, updatePublished = publish),
      defaultHtml = buildDefaultHtml(atom.atomType, atom.data)
    )

  def updateAtomFromJson(atom: Atom, json: Json, user: User): Either[AtomAPIError, Atom] = {
    val updatedAtomJson: Json = atom.asJson.deepMerge(json)

    jsonToAtom(updatedAtomJson)
  }

}