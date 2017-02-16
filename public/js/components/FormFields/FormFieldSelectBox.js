import React, {PropTypes} from 'react';

export default class FormFieldSelectBox extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    fieldValue: PropTypes.string.isRequired,
    selectValues: PropTypes.array.isRequired,
    onUpdateField: PropTypes.func.isRequired
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
