import React, {PropTypes} from 'react';

import {SingleDatePicker} from 'react-dates';
import format from 'date-fns/format';

import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';


export default class FormFieldDateInput extends React.Component {


  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.number,
    fieldPlaceholder: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func
  };

  state = {
    focused: false
  };

  onDateChange = (momentDate) => {
    this.props.onUpdateField(momentDate.valueOf());
  }

  render() {
    return (
        <div className={this.props.formRowClass || "form__row"}>
          {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
          <SingleDatePicker
            id="date_input"
            date={this.state.fieldValue}
            focused={this.state.focused}
            onDateChange={this.onDateChange}
            onFocusChange={({ focused }) => { this.setState({ focused }); }}
            numberOfMonths={1}
            placeholder={this.props.fieldValue ? format(this.props.fieldValue, "DD/MM/YYYY") : "Pick Expiry Date" }
          />
          <ShowErrors errors={this.props.fieldErrors}/>
        </div>

    );
  }
}
