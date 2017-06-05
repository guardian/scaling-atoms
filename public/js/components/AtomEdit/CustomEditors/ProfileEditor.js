import React, { PropTypes } from 'react';
import FormFieldImageSelect from '../../FormFields/FormFieldImageSelect';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import FormFieldArrayWrapper from '../../FormFields/FormFieldArrayWrapper';
import {ProfileItem} from './ProfileFields/ProfileItem';
import {ManagedField, ManagedForm} from '../../ManagedEditor';
import {atomPropType} from '../../../constants/atomPropType';


export class ProfileEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func
  }

  render () {
    return (
      <div className="form">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="profileEditor">
          <ManagedField fieldLocation="data.profile.typeLabel" name="Label">
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="data.profile.headshot" name="Head shot">
            <FormFieldImageSelect/>
          </ManagedField>
          <ManagedField fieldLocation="data.profile.items" name="Items">
            <FormFieldArrayWrapper>
              <ProfileItem onFormErrorsUpdate={this.props.onFormErrorsUpdate} />
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
