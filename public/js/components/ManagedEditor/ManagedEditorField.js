import React, {PropTypes} from 'react';
import _get from 'lodash/fp/get';
import _set from 'lodash/fp/set';
import validateField from '../../util/validateField';

export class ManagedField extends React.Component {

  state = {
    fieldErrors: [],
  };

  static propTypes = {
    fieldLocation: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]),
    updateData: PropTypes.func,
    updateFormErrors: PropTypes.func,
    data: PropTypes.object,
    name: PropTypes.string,
    isRequired: PropTypes.bool,
    customValidation: PropTypes.arrayOf(PropTypes.func)
  };

  updateFn = (newValue) => {
    Promise.resolve(validateField(newValue, this.props.isRequired, this.props.customValidation))
      .then(fieldErrors => {
        this.props.updateFormErrors(fieldErrors, this.props.name);
      });

      this.props.updateData(_set(this.props.fieldLocation, newValue, this.props.data));
  }

  render () {

    const hydratedChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        fieldName: this.props.name,
        fieldLabel: this.props.name,
        fieldValue: _get(this.props.fieldLocation, this.props.data),
        fieldErrors: this.state.fieldErrors,
        onUpdateField: this.updateFn,
      });
    });

    return <div>{hydratedChildren}</div>;
  }
}
