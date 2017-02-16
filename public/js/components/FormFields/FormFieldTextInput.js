import React, {PropTypes} from 'react';

export default class FormFieldTextInput extends React.Component {


  static propTypes = {
    fieldLabel: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    fieldValue: PropTypes.string.isRequired,
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func.isRequired,
    isValid: PropTypes.bool
  };

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  }


  render() {
    return (
        <div>
          <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label>
          <input type="text" className="form__field" id={this.props.fieldName} placeholder={this.props.fieldPlaceholder || ''} value={this.props.fieldValue} onChange={this.onUpdate}/>
        </div>

    );
  }
}
