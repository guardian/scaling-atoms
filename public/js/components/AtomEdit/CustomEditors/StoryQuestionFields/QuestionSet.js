import React, { PropTypes } from 'react';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import FormFieldArrayWrapper from '../../../FormFields/FormFieldArrayWrapper';
import {StoryQuestionsQuestion} from './Question.js';
import uuidv4 from 'uuid/v4';


export class StoryQuestionsQuestionSet extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      questionSetId: PropTypes.string,
      questionSetTitle: PropTypes.string,
      questions: PropTypes.array
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func
  };

  updateQuestionSet = (questionSet) => {
    const questionSetWithId = Object.assign({}, questionSet, {
      questionSetId: questionSet.questionSetId || uuidv4()
    });

    this.props.onUpdateField(questionSetWithId);
  }

  render () {
    return (
      <div className="form__field">
        <ManagedForm data={this.props.fieldValue} updateData={this.updateQuestionSet} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="storyquestionsEditor">
          <ManagedField fieldLocation="questionSetTitle" name="Question Set Title" isRequired={true}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="questions" name="Questions" isRequired={true}>
            <FormFieldArrayWrapper>
              <StoryQuestionsQuestion />
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
