import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import publishState from '../../util/publishState';

const atomPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  atomType: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  defaultHtml: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
});

class Header extends React.Component {

  static propTypes = {
    atom: atomPropType
  }

  renderPublishedState = () => {
    if(this.props.atom) {

      const atomPublishState = publishState(this.props.atom);

      return (
        <div className="toolbar__container">
          <nav className="main-nav" role="navigation">
            <ul className="main-nav__list">
              <li className="toolbar__item main-nav__item">
                <span className={`publish-state publish-state--${atomPublishState.id}`}>{atomPublishState.text}</span>
              </li>
            </ul>
          </nav>
        </div>
      );
    }
    return false;
  }

  render () {
    return (
        <div className="toolbar">

          <header className="toolbar__container">
            <Link className="toolbar__title" href="/">
              <div className="toolbar__logo"></div>
              <div className="toolbar__page-icon"></div>
              <div className="toolbar__title__hover-state">
                <span className="toolbar__title__hover-state__subtitle">Back to</span><br />
                <span className="toolbar__title__hover-state__title">Dashboard</span>
              </div>
            </Link>
          </header>
          {this.renderPublishedState()}
        </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    atom: state.atom
  };
}

export default connect(mapStateToProps)(Header);
