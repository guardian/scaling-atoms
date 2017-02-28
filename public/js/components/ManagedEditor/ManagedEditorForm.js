import React, {PropTypes} from 'react';
import _uniqueId from 'lodash/fp/uniqueId';

export class ManagedForm extends React.Component {

  static propTypes = {
    data: PropTypes.object,
    updateData: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  state: {
    id: '',
    formErrors: {}
  }

  componentWillMount() {
    this.setState({
      id: _uniqueId('form')
    });
  }

  updateFormErrors = (fieldErrors, fieldName) => {
    this.setState({
      formErrors: {
        [fieldName]: fieldErrors
      }
    });
  }


  render() {
    const hydratedChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        data: this.props.data,
        updateData: this.props.updateData,
        updateFormErrors: this.updateFormErrors
      });
    });

    return <form className="form">{hydratedChildren}</form>;
  }
}
