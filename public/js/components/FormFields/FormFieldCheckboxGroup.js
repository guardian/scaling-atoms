import React, {PropTypes} from 'react';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';
import FormFieldCheckbox from './FormFieldCheckbox';

export default class FormFieldCheckboxGroup extends React.Component {

  static propTypes = {

    fieldLabel: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    fieldValue: PropTypes.array.isRequired,
    checkValues: PropTypes.array.isRequired,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    onUpdateField: PropTypes.func.isRequired
  };

  addOrRemoveValue = (fieldName) => {
    let newFieldValue = [];

    if(this.props.fieldValue.includes(fieldName)) {
      newFieldValue = this.props.fieldValue.filter((value, currentIndex) => {
        return currentIndex !== fieldName;
      });
    } else {
      newFieldValue = this.props.fieldValue.concat(fieldName);
    }

    return newFieldValue;
  }

  isChecked = (checkValue) => {
    return this.props.fieldValue.includes(checkValue);
  }

  renderCheckbox(fieldName, i) {
    const updateFn = (newValue) => {
      let newFieldValue = [];
      if(newValue && !this.props.fieldValue.includes(newValue)) {
        newFieldValue = this.props.fieldValue.concat([fieldName]);
      } else {
        newFieldValue = this.props.fieldValue.filter((oldFieldName) => {
          return fieldName !== oldFieldName;
        });
      }
      this.props.onUpdateField(newFieldValue);
    };

    return (
      <FormFieldCheckbox
        key={`${this.props.fieldName}-${i}`}
        fieldName={`${this.props.fieldName}-${i}`}
        fieldValue={this.isChecked(fieldName)}
        onUpdateField={updateFn}
        checkGroup="true" />
    );
  }

  render() {
    return (
        <div>
          <label className="form__label" htmlFor={this.props.fieldName}>{this.props.fieldLabel}</label>
          {this.props.checkValues.map((fieldName, i) => this.renderCheckbox(fieldName, i))}
          {this.props.fieldErrors && this.props.fieldErrors.length ? <ShowErrors errors={this.props.fieldErrors}/>  : false}
        </div>
    );
  }
}
