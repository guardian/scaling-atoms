import React, {PropTypes} from 'react';
import FormFieldSelectBox from '../../../FormFields/FormFieldSelectBox';
import {errorPropType} from '../../../../constants/errorPropType';

export class ExplainerDisplayTypes extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    onUpdateField: PropTypes.func
  };

  displayTypes = [
    'flat',
    'expandable'
  ];

  render() {
    return (
      <FormFieldSelectBox
        fieldLabel={this.props.fieldLabel}
        fieldName={this.props.fieldName}
        fieldErrors={this.props.fieldErrors}
        selectValues={this.displayTypes}
        onUpdateField={this.props.onUpdateField} />
    );
  }
}
