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

  onUpdate = (fieldName) => {
    this.props.onUpdateField(this.addOrRemoveValue(fieldName));
  }

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

  renderCheckbox = (checkValue) => {
    return (
      <FormFieldCheckbox
        fieldName={checkValue}
        fieldValue={this.isChecked(checkValue)}
        onUpdateField={this.onUpdate} />
    );
  }

  renderCheckboxes = () => {
    return this.props.checkValues.map(this.renderCheckbox, this);
  }

  render() {
    return (
        <div>
          <label className="form__label" htmlFor={this.props.fieldName}>{this.props.fieldLabel}</label>
          {this.renderCheckboxes()}
          {this.props.fieldErrors && this.props.fieldErrors.length ? <ShowErrors errors={this.props.fieldErrors}/>  : false}
        </div>
    );
  }
}
