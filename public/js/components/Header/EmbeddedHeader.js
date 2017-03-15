import React, { PropTypes } from 'react';
import {Link} from 'react-router';

class EmbeddedHeader extends React.Component {

  static propTypes = {
    config: PropTypes.shape({
      isEmbedded: PropTypes.bool.isRequired,
      embeddedMode: PropTypes.string
    }),
    isFindPage: PropTypes.bool.isRequired
  }


  renderEmbeddedCreate() {
    return (
      <Link to="/create" className="toolbar__button">Create New Atom</Link>
    );
  }

  renderEmbeddedBackButton() {

    if (this.props.config.embeddedMode === "edit") {
      return false;
    }

    return (
      <Link to="/find" className="toolbar__button">Back to Atom Search</Link>
    );
  }
  render () {
    return (
      <div className="toolbar--embedded">
        {this.props.isFindPage ? this.renderEmbeddedCreate() : this.renderEmbeddedBackButton()}
      </div>
    );
  }
}

export default EmbeddedHeader;
