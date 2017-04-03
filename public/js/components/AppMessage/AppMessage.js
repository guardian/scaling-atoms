import React, {PropTypes} from 'react';

export default class AppMessage extends React.Component {

  static propTypes = {
    error: PropTypes.string
  }

  render() {
    return (
      this.props.error ? <div className="message-bar message-bar--error">{this.props.error}</div> : false
    );
  }
}