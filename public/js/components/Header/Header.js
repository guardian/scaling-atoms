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

  publishAtom = () => {
    this.props.atomActions.publishAtom(this.props.atom);
  }

  takeDownAtom = () => {
    this.props.atomActions.takeDownAtom(this.props.atom);
  }

  isEditor = () => {
    return location.pathname.search(new RegExp('\/atoms\/.*\/.*\/edit', 'g')) >= 0;
  }

  timeSinceLastModified = () => {
    if (this.props.atom.contentChangeDetails.created || this.props.atom.contentChangeDetails.lastModified) {
      const dateNow = Date.now();
      const lastModified = this.props.atom.contentChangeDetails.lastModified ? this.props.atom.contentChangeDetails.lastModified.date : this.props.atom.contentChangeDetails.created.date;
      return distanceInWords(dateNow, lastModified, {addSuffix: true});
    }
    return false;
  }

  renderSaveState = () => {

    if(this.props.saveState.saving === saveStateVals.inprogress) {
      return (
          <span className="loader save-state__loader">Saving</span>
      );
    }
    return (
      <span><span className="save-state">Saved</span> {this.timeSinceLastModified()}</span>
    );
  }

  renderPublishedState = () => {
    const atomPublishState = publishState(this.props.atom);
    return (
        <span className={`publish-state publish-state--${atomPublishState.id}`}>{atomPublishState.text}</span>
    );
  }

  renderTakeDownButton = (atomPublishState) => {
    if(atomPublishState.id !== 'draft') {
      return (
        <button type="button" disabled={atomPublishState.id === 'taken-down'} onClick={this.takeDownAtom} className="toolbar__item toolbar__button">Take down</button>
      );
    }
    return false;
  }

  renderHeaderRight = () => {

    const atomPublishState = publishState(this.props.atom);

    return (
        <div className="toolbar__container">
          {this.isEditor() && this.props.presence ? <PresenceIndicator presence={this.props.presence} /> : false}
          {this.isEditor() && this.props.atom ? <button disabled={atomPublishState.id === 'published'} type="button" onClick={this.publishAtom} className="toolbar__item toolbar__button">Publish</button> : false}
          {this.isEditor() && this.props.atom ? this.renderTakeDownButton(atomPublishState) : false}
          {this.props.isFindPage ? <Link to="/create" className="toolbar__item toolbar__button"><button type="button" className="">Create new</button></Link> : false}
        </div>
    );
  }

  renderAtomStates = () => {
    if (this.isEditor() && this.props.atom) {
      return (
          <nav className="main-nav" role="navigation">
            <ul className="main-nav__list">
              <li className="toolbar__item main-nav__item">
                {this.renderPublishedState()}
              </li>
              <li className="toolbar__item main-nav__item">
                {this.renderSaveState()}
              </li>
            </ul>
          </nav>
      );
    }
    return false;
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
            {this.renderAtomStates()}
          </div>
            {this.renderHeaderRight()}
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
