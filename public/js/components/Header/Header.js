import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import publishState from '../../util/publishState';
import PresenceIndicator from '../Utilities/PresenceIndicator';
import {saveStateVals} from '../../constants/saveStateVals';
import distanceInWords from 'date-fns/distance_in_words';
import EmbeddedHeader from './EmbeddedHeader';

const atomPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  atomType: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  defaultHtml: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
});

class Header extends React.Component {

  static propTypes = {
    atom: atomPropType,
    presence: PropTypes.object,
    saveState: PropTypes.object,
    atomActions: PropTypes.shape({
      publishAtom: PropTypes.func.isRequired,
      takeDownAtom: PropTypes.func.isRequired
    }).isRequired,
    config: PropTypes.shape({
      isEmbedded: PropTypes.bool.isRequired
    }),
    isFindPage: PropTypes.bool.isRequired
  }

  state: {
    editMode: false
  }

  render () {

    if (this.props.config.isEmbedded) {
      return <EmbeddedHeader config={this.props.config} isFindPage={this.props.isFindPage}/>;
    }

    return (
        <div className="toolbar">
          <div className="toolbar__container">
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
          </div>
        </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as publishAtomActions from '../../actions/AtomActions/publishAtom.js';
import * as takeDownAtomActions from '../../actions/AtomActions/takeDownAtom.js';

function mapStateToProps(state) {
  return {
    atom: state.atom,
    saveState: state.saveState,
    config: state.config,
    presence: state.presence
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, publishAtomActions, takeDownAtomActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
