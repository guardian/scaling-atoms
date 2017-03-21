import React from 'react';

import publishState from '../../util/publishState';
import PresenceIndicator from '../Utilities/PresenceIndicator';
import {saveStateVals} from '../../constants/saveStateVals';
import distanceInWords from 'date-fns/distance_in_words';

export default class EditHeader extends React.Component {

  publishAtom = () => {
    this.props.publishAtom(this.props.atom);
  }

  takeDownAtom = () => {
    this.props.takeDownAtom(this.props.atom);
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

  render() {
    return (
      <p>Edit Header</p>
    );
  }
}
