import React, {PropTypes} from 'react';
import _get from 'lodash/fp/get';
import _set from 'lodash/fp/set';
import validateField from '../../util/validateField';

export class ManagedField extends React.Component {

  static propTypes = {
    fieldLocation: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]),
    updateData: PropTypes.func,
    data: PropTypes.object,
    name: PropTypes.string,
    isRequired: PropTypes.bool,
    customValidation: PropTypes.arrayOf(PropTypes.func)
  };

  updateFn = (newValue) => {
    this.props.updateData(_set(this.props.fieldLocation, newValue, this.props.data));
    validateField(newValue, this.props.isRequired, this.props.customValidation);
  }

  render () {

    const hydratedChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        fieldName: this.props.name,
        fieldLabel: this.props.name,
        fieldValue: _get(this.props.fieldLocation, this.props.data),
        onUpdateField: this.updateFn
      });
    });

    return <div>{hydratedChildren}</div>;
  }
}
