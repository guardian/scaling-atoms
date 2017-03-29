import React, {PropTypes} from 'react';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';

export default class FormFieldMultiSelect extends React.Component {

  static propTypes = {

    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.array,
    selectValues: PropTypes.array.isRequired,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func
  };

  state = {
    showOptions: false
  }

  showOptions = () => {
    this.setState({showOptions: true});
  }

  hideOptions = () => {
    this.setState({showOptions: false});
  }

  isSelected = (selectValue) => {
    return this.props.fieldValue.indexOf(selectValue) !== -1;
  }

  renderValue = (fieldName, i) => {

    const removeFn = () => {
      let newFieldValue = this.props.fieldValue.filter((oldFieldName) => {
        return fieldName !== oldFieldName;
      });
      this.props.onUpdateField(newFieldValue);
    };

    return (
      <span className="form__field--multiselect__value" key={`${fieldName}-${i}`} onClick={removeFn}>{fieldName} </span>
    );
  }

  renderOption(fieldName, i) {

    if(this.isSelected(fieldName)) {
      return false;
    }

    const addFn = () => {
      let newFieldValue = this.props.fieldValue.concat([fieldName]);
      this.props.onUpdateField(newFieldValue);
      this.setState({showOptions: false});
    };

    return (
      <div className="form__field--multiselect__option" key={`${this.props.fieldName}-${i}`} onClick={addFn}>
        {fieldName}
      </div>
    );
  }

  render() {
    return (
        <div className={this.props.formRowClass || "form__row"}>
            {this.props.fieldLabel && <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label>}

            <div className="form__field form__field--multi-select">
              {this.props.fieldValue && this.props.fieldValue.map((fieldName, i) => this.renderValue(fieldName, i))}
            </div>
            <button type="button" className="btn" onClick={this.showOptions}>Add</button>

            {this.state.showOptions && this.props.selectValues.map((fieldName, i) => this.renderOption(fieldName, i))}
          <ShowErrors errors={this.props.fieldErrors}/>
        </div>
    );
  }
}
