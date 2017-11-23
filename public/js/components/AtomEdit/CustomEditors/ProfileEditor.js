import React, { PropTypes } from 'react';
import FormFieldImageSelect from '../../FormFields/FormFieldImageSelect';
import FormFieldArrayWrapper from '../../FormFields/FormFieldArrayWrapper';
import {ProfileItem} from './ProfileFields/ProfileItem';
import {ManagedField, ManagedForm} from '../../ManagedEditor';
import {atomPropType} from '../../../constants/atomPropType';
import {checkItemsUnderWordCount} from '../../../util/validators';

export class ProfileEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func,
    config: PropTypes.shape({
      gridUrl: PropTypes.string.isRequired
    }).isRequired
  }

  render () {
    return (
      <div className="form">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="profileEditor">
          <ManagedField fieldLocation="data.profile.headshot" name="Head shot">
            <FormFieldImageSelect gridUrl={this.props.config.gridUrl}/>
          </ManagedField>
          <ManagedField fieldLocation="data.profile.items" name="Items" customValidation={[checkItemsUnderWordCount]}>
            <FormFieldArrayWrapper>
              <ProfileItem onFormErrorsUpdate={this.props.onFormErrorsUpdate} />
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
