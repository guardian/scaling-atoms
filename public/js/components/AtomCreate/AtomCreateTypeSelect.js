import React from 'react';
import {Link} from 'react-router';

import {getNonEditableAtomTypes, snippetAtomTypes, editableNonSnippetAtomTypes, experimentalAtomTypes} from '../../constants/atomData';
import {AtomTypeCard} from '../AtomTypeCard/AtomTypeCard';


export class AtomCreateTypeSelect extends React.Component {

  renderAtomType(atomType) {
    const path = atomType.type === "commonsdivision" ? "/commonsdivisions" : `/create/${atomType.type}`;
    return (
      <Link
        to={path}
        className={"create__link"}
        key={atomType.type}
        >
        <AtomTypeCard atomType={atomType} />
      </Link>
    );
  }

  render () {
    return (
      <div className="page__section">
        <h1 className="page__subheading">Create new snippet atom</h1>
        <div className="create__note">
          A variety of atom types designed to give readers the context they need
          to make sense of a complex news story
        </div>
        <div className="create__cards">
          {snippetAtomTypes.map(this.renderAtomType)}
        </div>
        <h1 className="page__subheading">Create new atom</h1>
        <div className="create__cards">
          {editableNonSnippetAtomTypes.map(this.renderAtomType)}
        </div>
        <h1 className="page__subheading">Other Atoms</h1>
        <div className="create__note">
          These atoms have their own dedicated tools and cannot be created in
          Atom Workshop directly, you will be taken to their own dedicated editor
        </div>
        <div className="create__cards">
          {getNonEditableAtomTypes().map(this.renderAtomType)}
        </div>
        <h1 className="page__subheading">Experimental atoms</h1>
        <div className="create__note">
          These atoms are not supported so will not display correctly. Use only for testing purposes. 
        </div>
        <div className="create__cards">
          {experimentalAtomTypes.map(this.renderAtomType)}
        </div>
      </div>
    );
  }
}
