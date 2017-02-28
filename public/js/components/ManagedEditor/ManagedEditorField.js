import React, {PropTypes} from 'react';
import _get from 'lodash/fp/get';
import _set from 'lodash/fp/set';
import _debounce from 'lodash/fp/debounce';
import validateField from '../../util/validateField';

export class ManagedField extends React.Component {

  state = {
    fieldErrors: [],
    fieldValue: _get(this.props.fieldLocation, this.props.data),
  };

  // debounce the passed in dispatch method
  updateData = _debounce(250, this.props.updateData);

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
    Promise.resolve(validateField(newValue, this.props.isRequired, this.props.customValidation))
      .then(fieldErrors => {
        this.setState({
          fieldErrors: fieldErrors
        });
      });

    this.setState({
      fieldValue: newValue
    }, () => {
      this.updateData(_set(this.props.fieldLocation, this.state.fieldValue, this.props.data));
    });
  }

  render () {

    const hydratedChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        fieldName: this.props.name,
        fieldLabel: this.props.name,
        fieldValue: this.state.fieldValue,
        fieldErrors: this.state.fieldErrors,
        onUpdateField: this.updateFn,
      });
    });

    return <div>{hydratedChildren}</div>;
  }
}
