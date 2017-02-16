import React, {PropTypes} from 'react';
import FormFieldSelectBox from '../../../FormFields/FormFieldSelectBox';

export class ExplainerDisplayTypes extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func
  };

  displayTypes = [
    'flat',
    'expandable'
  ];

  render() {
    return (
      <FormFieldSelectBox
        selectValues={this.displayTypes}
        onUpdateField={this.props.onUpdateField} />
    );
  }
}
