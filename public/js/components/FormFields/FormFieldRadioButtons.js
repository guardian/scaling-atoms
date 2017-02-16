import React, {PropTypes} from 'react';

export default class FormFieldRadioButtons extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    selectValues: PropTypes.array.isRequired,
    fieldValue: PropTypes.string,
    onUpdateField: PropTypes.func.isRequired
  };

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  }

  renderButton(value, i) {
    return (
      <div key={i} className="form__group form__group--radio">
        <input className="form__radio-btn" type="radio" name={this.props.fieldName} value={value} checked={this.props.fieldValue === value ? 'checked' : false} onChange={this.onUpdate} />
        <span className="form__label form__label--radio">{value}</span>
      </div>
    );
  }

  renderButtons() {
    return this.props.selectValues.map(this.renderButton, this);
  }

  render() {
    return (
        <div>
          <label className="form__label" htmlFor={this.props.fieldName}>{this.props.fieldLabel}</label>
          {this.renderButtons()}
        </div>
    );
  }
}
