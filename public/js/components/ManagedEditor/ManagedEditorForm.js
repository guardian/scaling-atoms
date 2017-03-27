import React, {PropTypes} from 'react';
import _uniqueId from 'lodash/fp/uniqueId';

export class ManagedForm extends React.Component {

  static propTypes = {
    data: PropTypes.object,
    updateData: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]),
    onFormErrorsUpdate: PropTypes.func,
    onFormErrorStateUpdate: PropTypes.func // Helper method that just returns true/false
  };

  state = {
    id: '',
    formErrors: {}
  }

  componentWillMount() {
    this.setState({
      id: _uniqueId('form')
    });
  }

  hasFormErrors(formErrorsObject) {
    const fieldWithError = Object.keys(formErrorsObject).find((key) => formErrorsObject[key].length > 0);
    return !!fieldWithError;
  }

  updateFormErrors = (fieldErrors, fieldName) => {

    const formErrors = Object.assign({}, this.state.formErrors, {
      [fieldName]: fieldErrors
    });

    this.setState({
      formErrors: formErrors
    });

    this.props.onFormErrorsUpdate && this.props.onFormErrorsUpdate(formErrors);
    this.props.onFormErrorStateUpdate && this.props.onFormErrorStateUpdate(this.hasFormErrors(formErrors));
  }


  render() {
    const hydratedChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        data: this.props.data,
        updateData: this.props.updateData,
        updateFormErrors: this.updateFormErrors
      });
    });

    return <div className="form">{hydratedChildren}</div>;
  }
}
