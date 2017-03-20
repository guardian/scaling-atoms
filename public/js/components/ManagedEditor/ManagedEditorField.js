import React, {PropTypes} from 'react';
import _get from 'lodash/fp/get';
import _set from 'lodash/fp/set';
import validateField from '../../util/validateField';

export class ManagedField extends React.Component {

  state = {
    fieldErrors: [],
    touched: false
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

  componentDidMount() {
    this.runValidations(_get(this.props.fieldLocation, this.props.data));
  }

  runValidations(data) {
    Promise.resolve(validateField(data, this.props.isRequired, this.props.customValidation))
      .then(fieldErrors => {
        this.setState({
          fieldErrors: fieldErrors
        });
        this.props.updateFormErrors(fieldErrors, this.props.name);
      });
  }

  updateFn = (newValue) => {
    this.setState({
      touched: true
    });

    this.runValidations(newValue);
    this.props.updateData(_set(this.props.fieldLocation, newValue, this.props.data));
  }

  render () {
    const hydratedChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        fieldName: this.props.name,
        fieldLabel: this.props.name,
        fieldValue: _get(this.props.fieldLocation, this.props.data),
        fieldErrors: this.state.touched ? this.state.fieldErrors : undefined,
        onUpdateField: this.updateFn,
      });
    });

    return <div>{hydratedChildren}</div>;
  }
}
