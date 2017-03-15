import React, {PropTypes} from 'react';
import Header from './Header/Header';

import {routerShape} from 'react-router/lib/PropTypes';

class Page extends React.Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    config: PropTypes.shape({
      isEmbedded: PropTypes.bool.isRequired
    }),
    router: routerShape
  }

  isFindPage() {
    return this.props.router.isActive("/find");
  }

  render() {
    return (
      <div className={this.props.config.isEmbedded ? "page is-embedded" : "page"}>
        <Header router={this.props.router} isFindPage={this.isFindPage()}/>
        <div className="page__content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    config: state.config
  };
}


export default connect(mapStateToProps)(Page);
