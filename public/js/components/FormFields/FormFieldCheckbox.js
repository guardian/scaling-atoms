import React, {PropTypes} from 'react';
import { errorPropType } from '../../constants/errorPropType';

export default class FormFieldCheckbox extends React.Component {

  static propTypes = {

    fieldLabel: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    fieldValue: PropTypes.array.isRequired,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    onUpdateField: PropTypes.func.isRequired
  };

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  }

  renderCheckbox(value, i) {
    return (
      <div key={i} className="form__group form__group--checkbox">
        <input className="form__checkbox" type="checkbox" checked={value.selected} name={this.props.fieldName} value={value} onChange={this.onUpdate} />
        <span className="form__label form__label--checkbox">{value.id}</span>
      </div>
    );
  }

  renderCheckboxes() {
    return this.props.fieldValue.map(this.renderCheckbox, this);
  }

  render() {
    return (
        <div>
          <label className="form__label" htmlFor={this.props.fieldName}>{this.props.fieldLabel}</label>
          {this.renderCheckboxes()}
        </div>
    );
  }
}
