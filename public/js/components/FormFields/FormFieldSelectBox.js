import React, {PropTypes} from 'react';
import { errorPropType } from '../../constants/errorPropType';

export default class FormFieldSelectBox extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    selectValues: PropTypes.array,
    onUpdateField: PropTypes.func
  };

  renderOption(option) {
    return (
        <option key={option} value={option}>{option}</option>
    );
  }

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  }


  renderOptions() {
    return this.props.selectValues.map(this.renderOption);
  }

  render() {
    return (
        <div>
          <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label>
          <select className="form__field form__field--select" value={this.props.fieldValue} onChange={this.onUpdate}>
            {this.renderOptions()}
          </select>
        </div>
    );
  }
}
