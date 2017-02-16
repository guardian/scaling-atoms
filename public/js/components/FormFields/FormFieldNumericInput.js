import React, {PropTypes} from 'react';

export default class FormFieldNumericInput extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    fieldValue: PropTypes.string.isRequired,
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func.isRequired
  };

  onUpdate = (e) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);

    if (parsedValue) {
      this.props.onUpdateField(parsedValue);
    } else if (value === "") {
      this.props.onUpdateField(undefined);
    }
  }

  render() {
    return (
        <div>
          <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label>
          <input type="number" className="form__field" id={this.props.fieldName} placeholder={this.props.fieldPlaceholder || ''} value={this.props.fieldValue || 0} onChange={this.onUpdate}/>
        </div>

    );
  }
}
