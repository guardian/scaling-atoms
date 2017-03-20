import React, {PropTypes} from 'react';
import {atomPropType} from '../../constants/atomPropType.js';
import copy from 'copy-to-clipboard';

import CurrentTargets from './CurrentTargets';

class AtomEmbed extends React.Component {

  static propTypes = {
    atom: atomPropType,
    config: PropTypes.shape({
      capiLiveUrl: PropTypes.string.isRequired,
      isEmbedded: PropTypes.bool.isRequired
    })
  }

  state = {
    copied: false
  }

  generateEmbedUrl() {
    if (!this.props.atom) {
      return "";
    }

    const atom = this.props.atom;
    return `${this.props.config.capiLiveUrl}/atom/${atom.atomType.toLowerCase()}/${atom.id}`;
  }

  copyUrl = () => {
    copy(this.generateEmbedUrl());

    this.setState({copied: true});

    setTimeout(() => {
      this.setState({copied: false});
    }, 5000);
  }

  render () {

    if (this.props.config.isEmbedded) {
      return false;
    }

    if (!this.props.atom) {
      return false;
    }

    return (
      <div className="atom-embed">
        <div className="form">
          <div className="form__row">
            <h3 className="form__subheading">Embed This Atom</h3>
            <div className="form__row">
              <label htmlFor="embedUrl" className="form__label">Embed URL</label>
              <input id="embedUrl" className="form__field" value={this.generateEmbedUrl()} readOnly={true}/>
              <button className="btn" onClick={this.copyUrl}>
                {this.state.copied ? "Copied!" : "Copy URL"}
              </button>
            </div>
          </div>
          <div className="form__row">
            <h3 className="form__subheading">Suggest This Atom</h3>
            <div className="form__row">
              <CurrentTargets atom={this.props.atom} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AtomEmbed;
