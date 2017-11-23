import React, { PropTypes } from 'react';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldsScribeEditor from '../../../FormFields/FormFieldScribeEditor';

export class QAItem extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      title: PropTypes.string,
      date: PropTypes.date,
      body: PropTypes.string
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func
  };

  updateItem = (item) => {
    this.props.onUpdateField(item);
  }

  render () {
    const value = this.props.fieldValue || {
      title: "",
      body: ""
    };
    return (
      <div className="form__field">
        <ManagedForm data={value} updateData={this.updateItem} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="qaEditor">
          <ManagedField fieldLocation="body" name="Answer" isRequired={true}>
            <FormFieldsScribeEditor showWordCount={true} suggestedLength={250} showToolbar={false} tooLongMsg={"You've exceed the word limit of 250 for this atom."}/>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
