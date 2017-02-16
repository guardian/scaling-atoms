import React, {PropTypes} from 'react';
import {errorPropType} from '../../constants/errorPropType';

export default class ShowErrors extends React.Component {

  static propTypes = {
    errors: PropTypes.arrayOf(errorPropType)
  }

  renderError = (error, i) => {
    return (
      <div key={i} className="form__message">
        <p className="form__message__text form__message__text--error">Error: {error.title}</p>
        <p className="form__message__text form__message__text--error">Message: {error.message}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.errors && this.props.errors.length ? this.props.errors.map((error, i) => this.renderError(error, i)) : false}
      </div>
    );
  }
}
