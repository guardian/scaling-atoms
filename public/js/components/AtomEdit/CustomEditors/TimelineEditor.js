import React, { PropTypes } from 'react';
import FormFieldArrayWrapper from '../../FormFields/FormFieldArrayWrapper';
import {TimelineItem} from './TimelineFields/TimelineItem';
import {ManagedField, ManagedForm} from '../../ManagedEditor';
import {atomPropType} from '../../../constants/atomPropType';
import FormFieldsScribeEditor from '../../FormFields/FormFieldScribeEditor';
import {checkItemsUnderWordCount} from '../../../util/validators';

export class TimelineEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func
  }

  render () {

    return (
      <div className="form">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="timelineEditor">
          <ManagedField fieldLocation="data.timeline.description" name="Description - optional" isRequired={false}>
            <FormFieldsScribeEditor showWordCount={true} suggestedLength={50} showToolbar={false} tooLongMsg={"Remember that snippets should be concise"}/>
          </ManagedField>
          <ManagedField fieldLocation="data.timeline.events" name="Events" customValidation={[checkItemsUnderWordCount]}>
            <FormFieldArrayWrapper>
              <TimelineItem onFormErrorsUpdate={this.props.onFormErrorsUpdate}/>
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
