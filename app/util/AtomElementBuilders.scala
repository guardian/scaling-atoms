package util

import com.gu.contentatom.thrift.atom.cta.CTAAtom
import com.gu.contentatom.thrift.atom.explainer.{DisplayType, ExplainerAtom}
import com.gu.contentatom.thrift.atom.recipe.{RecipeAtom, Tags => RecipeTags, Time => RecipeTime}

import com.gu.contentatom.thrift.{User, _}
import com.gu.pandomainauth.model.{User => PandaUser}
import org.joda.time.DateTime

object AtomElementBuilders {

  def buildContentChangeDetails(user: PandaUser, existingContentChangeDetails: Option[ContentChangeDetails], updateCreated: Boolean = false,
    updateLastModified: Boolean = false, updatePublished: Boolean = false): ContentChangeDetails = {

    def pandaUserToAtomUser(user: PandaUser): User = {
      User(user.email, Some(user.firstName), Some(user.lastName))
    }
    def buildChangeRecord(existingRecord: Option[ChangeRecord], shouldUpdate: Boolean) = {
      if (shouldUpdate) {
        Some(ChangeRecord(DateTime.now.getMillis, user=Some(pandaUserToAtomUser(user))))
      } else if (existingRecord.isDefined) existingRecord else None
    }
    ContentChangeDetails(
      created      = buildChangeRecord(existingContentChangeDetails.flatMap(_.created)     , updateCreated),
      lastModified = buildChangeRecord(existingContentChangeDetails.flatMap(_.lastModified), updateLastModified),
      published    = buildChangeRecord(existingContentChangeDetails.flatMap(_.published)   , updatePublished),
      revision     = existingContentChangeDetails.map(_.revision).getOrElse(0L) + 1
    )
  }

  def buildDefaultAtom(atomType: AtomType, user: PandaUser): Atom = {
    val defaultAtoms: Map[AtomType, AtomData] = Map(
      AtomType.Explainer -> AtomData.Explainer(ExplainerAtom("-", "-", DisplayType.Flat)),
      AtomType.Cta -> AtomData.Cta(CTAAtom("-")),
      AtomType.Recipe -> AtomData.Recipe(RecipeAtom("-", RecipeTags(), RecipeTime()))
    )

    Atom(id = java.util.UUID.randomUUID.toString,
      atomType = atomType,
      defaultHtml = buildDefaultHtml(atomType = atomType, atomData = defaultAtoms(atomType)),
      data = defaultAtoms(atomType),
      contentChangeDetails = buildContentChangeDetails(user, None, updateCreated = true)
    )
  }

  // this is just a stub - will eventually need to generate default HTML for all the atom types we support
  def buildDefaultHtml(atomType: AtomType, atomData: AtomData, currentDefaultHtml: Option[String] = None): String = {
    currentDefaultHtml.getOrElse(s"""<div class="atom-${atomType.name}"></div>""")
  }
}