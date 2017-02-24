import React, { PropTypes } from 'react';

import {ManagedForm, ManagedField} from '../../ManagedEditor';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import {isHttpsUrl} from '../../../util/validators';

export class CTAEditor extends React.Component {

  static propTypes = {
    atom: PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.string
    }).isRequired,
    onUpdate: PropTypes.func.isRequired
  }

  render () {

    return (
      <div className="atom-editor">
        <h1 className="atom-editor__title">{`Editing CTA: ${this.props.atom.id}`}</h1>
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate}>
          <ManagedField fieldLocation="data.url" name="Link Url" isRequired={true}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="data.btnText" name="Button Text">
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.backgroundImage" name="Background Image Url" customValidation={[isHttpsUrl]}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.label" name="Background Text">
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.trackingcode" name="Tracking Code">
            <FormFieldTextInput />
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
