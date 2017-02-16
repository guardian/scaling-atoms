import React, {PropTypes} from 'react';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';

export default class FormFieldTextInput extends React.Component {


  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
    fieldPlaceholder: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    onUpdateField: PropTypes.func
  };

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  }

  render() {
    return (
        <div>
          <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label>
          <input type="text" className={"form__field " + (this.props.fieldErrors && this.props.fieldErrors.length ? "form__field--error" : "")}  id={this.props.fieldName} placeholder={this.props.fieldPlaceholder || ''} onChange={this.onUpdate}  value={this.props.fieldValue || ""}/>
          {this.props.fieldErrors && this.props.fieldErrors.length ? <ShowErrors errors={this.props.fieldErrors}/>  : false}
        </div>

    );
  }
}
