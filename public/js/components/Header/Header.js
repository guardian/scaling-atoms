import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import publishState from '../../util/publishState';
import {saveStateVals} from '../../constants/saveStateVals';
import distanceInWords from 'date-fns/distance_in_words';

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
    saveState: PropTypes.object,
    atomActions: PropTypes.shape({
      publishAtom: PropTypes.func.isRequired,
      takeDownAtom: PropTypes.func.isRequired
    }).isRequired,
  }

  publishAtom = () => {
    this.props.atomActions.publishAtom(this.props.atom);
  }

  takeDownAtom = () => {
    this.props.atomActions.takeDownAtom(this.props.atom);
  }

  renderSaveState = () => {
    const dateNow = Date.now();
    const lastModified = this.props.atom.contentChangeDetails.lastModified ? this.props.atom.contentChangeDetails.lastModified.date : this.props.atom.contentChangeDetails.created.date;
    const timeSinceLastModified = distanceInWords(dateNow, lastModified, {addSuffix: true});

    if(this.props.saveState.saving === saveStateVals.inprogress) {
      return (
          <span className="loader save-state__loader">Saving</span>
      );
    }
    return (
      <span><span className="save-state">Saved</span> {timeSinceLastModified}</span>
    );
  }

  renderPublishedState = () => {
    if(this.props.atom) {

      const atomPublishState = publishState(this.props.atom);

      return (
        <nav className="main-nav" role="navigation">
          <ul className="main-nav__list">
            <li className="toolbar__item main-nav__item">
              <span className={`publish-state publish-state--${atomPublishState.id}`}>{atomPublishState.text}</span>
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

  renderPublishButton = () => {
    if(this.props.atom) {

      const atomPublishState = publishState(this.props.atom);

      return (
        <div className="toolbar__container">
          <button disabled={atomPublishState.id === 'published'} type="button" onClick={this.publishAtom} className="toolbar__item toolbar__button">Publish</button>
          {this.renderTakeDownButton(atomPublishState)}
        </div>
      );
    }
    return false;
  }

  renderTakeDownButton = (atomPublishState) => {
    if(atomPublishState.id !== 'draft' && atomPublishState !== 'taken-down') {
      return (
        <button type="button" onClick={this.takeDownAtom} className="toolbar__item toolbar__button">Take down</button>
      );
    }
    return false;
  }

  render () {
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
            {this.renderPublishedState()}
          </div>
            {this.renderPublishButton()}
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
    saveState: state.saveState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, publishAtomActions, takeDownAtomActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
