import React, { PropTypes } from 'react';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldTextArea from '../../../FormFields/FormFieldTextArea';

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
            <FormFieldTextArea/>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
