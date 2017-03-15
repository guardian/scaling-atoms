import React, { PropTypes } from 'react';
import {atomPropType} from '../../constants/atomPropType.js';
import {allAtomTypes} from '../../constants/atomData.js';

import {ManagedForm, ManagedField} from '../ManagedEditor';
import FormFieldTextInput from '../FormFields/FormFieldTextInput';


export default class AtomEditHeader extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired
  }

  renderDate(dateType) {

    const dateInfo = this.props.atom.contentChangeDetails[dateType];

    if (!dateInfo) {
      return 'Never';
    }

    const date = new Date(dateInfo.date);
    const nameOfUser = dateInfo.user ? ` by ${dateInfo.user.firstName} ${dateInfo.user.lastName}` : '';
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()} ${nameOfUser}`;
  }


  render () {

    const atomTypeData = allAtomTypes.filter(atomData => {
      return atomData.type.toLowerCase() === this.props.atom.atomType.toLowerCase();
    })[0];

    const atomTypeName = atomTypeData ? atomTypeData.fullName : this.props.atom.atomType;

    return (
      <div className="atom-card--header" key={this.props.atom.atomType}>
        <div className="atom-card__icon">
          <img src={`/assets/images/typeicons/${this.props.atom.atomType.toLowerCase()}-icon.svg`} />
        </div>
        <div className="atom-card__details">
          <h3 className="atom-card__heading">{atomTypeName} Atom</h3>
          <ManagedForm data={this.props.atom} updateData={this.props.onUpdate}>
            <ManagedField fieldLocation="title" name="Title:">
              <FormFieldTextInput/>
            </ManagedField>
          </ManagedForm>
          <ul className="atom-card__dates">
            <li><b>Created: </b>{this.renderDate('created')}</li>
            <li><b>Last Modified: </b>{this.renderDate('lastModified')}</li>
            <li><b>Published: </b>{this.renderDate('published')}</li>
          </ul>
        </div>
      </div>
    );
  }
}
