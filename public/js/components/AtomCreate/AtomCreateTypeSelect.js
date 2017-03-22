import React from 'react';
import {Link} from 'react-router';

import {workshopEditableAtomTypes, getNonEditableAtomTypes} from '../../constants/atomData';
import {AtomTypeCard} from '../AtomTypeCard/AtomTypeCard';


export class AtomCreateTypeSelect extends React.Component {

  renderAtomType(atomType) {
    return (
      <Link
        to={`/create/${atomType.type}`}
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
        <h1 className="page__subheading">Create an Atom</h1>
        <div className="create__cards">
          {workshopEditableAtomTypes.map(this.renderAtomType)}
        </div>
        <h1 className="page__subheading">Other Atoms</h1>
        <div className="create__note">
          These atoms have their own dedicated tools and cannot be created in
          Atom Workshop directly, you will be taken to their own dedicated editor
        </div>
        <div className="create__cards">
          {getNonEditableAtomTypes().map(this.renderAtomType)}
        </div>
      </div>
    );
  }
}
