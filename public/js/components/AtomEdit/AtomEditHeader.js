import React, { PropTypes } from 'react';
import {atomPropType} from '../../constants/atomPropType.js';

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
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}` +
            ` by ${dateInfo.user.firstName} ${dateInfo.user.lastName}`;
  }


  render () {
    return (
      <div className="atom-card" key={this.props.atom.atomType}>
        <div className="atom-card__icon">
          <img src={`/assets/images/typeicons/${this.props.atom.atomType}-icon.svg`} />
        </div>
        <div className="atom-card__details">
          <h3 className="atom-card__heading">{this.props.atom.atomType} Atom</h3>
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
