import React, {PropTypes} from 'react';

const errorPropType = PropTypes.shape({
  error: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
});

export default class FormFieldTextInput extends React.Component {


  static propTypes = {
    fieldLabel: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    fieldValue: PropTypes.string.isRequired,
    fieldPlaceholder: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    onUpdateField: PropTypes.func.isRequired,
    isValid: React.PropTypes.bool
  };

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  }

  renderErrors = () => {
    return this.props.fieldErrors.map((fieldError, i) => <div key={i} className="form__message">
                                                        <p className="form__message__text form__message__text--error">Error: {fieldError.error}</p>
                                                        <p className="form__message__text form__message__text--error">Message: {fieldError.message}</p>
                                                      </div>);
  }


  render() {
    return (
        <div>
          <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label>
          <input type="text" className={"form__field " + (this.props.fieldErrors.length ? "form__field--error" : "")} id={this.props.fieldName} placeholder={this.props.fieldPlaceholder || ""} value={this.props.fieldValue} onChange={this.onUpdate}/>
          {this.props.fieldErrors.length ? this.renderErrors() : false}
        </div>

    );
  }
}
