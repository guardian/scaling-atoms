import React, { PropTypes } from 'react';
import FormFieldTagPicker from '../../FormFields/FormFieldTagPicker';
import {ManagedField, ManagedForm} from '../../ManagedEditor';
import {atomPropType} from '../../../constants/atomPropType';

export class StoryQuestionsEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired
  }

  render () {
    return (
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate}>
          <ManagedField fieldLocation="data.storyquestions.relatedStoryId" name="Related Tag" isRequired={true}>
            <FormFieldTagPicker/>
          </ManagedField>
        </ManagedForm>
    );
  }
}
