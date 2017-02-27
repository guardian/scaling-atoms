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
      <ManagedForm data={this.props.atom} updateData={this.props.onUpdate}>
        <ManagedField fieldLocation="data.cta.url" name="Link Url" isRequired={true}>
          <FormFieldTextInput/>
        </ManagedField>
        <ManagedField fieldLocation="data.cta.btnText" name="Button Text">
          <FormFieldTextInput />
        </ManagedField>
        <ManagedField fieldLocation="data.cta.backgroundImage" name="Background Image Url" customValidation={[isHttpsUrl]}>
          <FormFieldTextInput />
        </ManagedField>
        <ManagedField fieldLocation="data.cta.label" name="Background Text">
          <FormFieldTextInput />
        </ManagedField>
        <ManagedField fieldLocation="data.cta.trackingcode" name="Tracking Code">
          <FormFieldTextInput />
        </ManagedField>
      </ManagedForm>
    );
  }
}
