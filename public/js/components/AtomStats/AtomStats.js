import React, {PropTypes} from 'react';
import {atomPropType} from '../../constants/atomPropType';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import {FrontendIcon, ComposerIcon, ViewerIcon} from '../../util/icons.js';

class AtomStats extends React.Component {
  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    atomActions: PropTypes.shape({
      getAtomUsages: PropTypes.func.isRequired,
    }).isRequired,
    atom: atomPropType,
    atomUsages: PropTypes.array,
    config: PropTypes.shape({
      composerUrl: PropTypes.string.isRequired,
      viewerUrl: PropTypes.string.isRequired
    }).isRequired
  }

  componentWillMount() {
    this.props.atomActions.getAtomUsages(this.props.routeParams.atomType, this.props.routeParams.id);
  }


  renderAtomDetail = (name, value) => {
    return (
      <li key={name} className="details-list__item">
        <span className="details-list__title">{name}:</span> {value}
      </li>
    );
  }

  renderAtomDetails = () => {
    if(this.props.atom) {
      const atomType = this.props.routeParams.atomType.toLowerCase();
      return (
        <ul className="details-list">
          {
            Object.keys(this.props.atom.data[atomType])
            .map(key => this.renderAtomDetail(key, this.props.atom.data[atomType][key]))
          }
        </ul>
      );
    }
  }

  renderAtomUsage = (usage, i) => {
    const composerLink = `${this.props.config.composerUrl}/content/${usage.fields.internalComposerCode}`;
    const viewerLink = `${this.props.config.viewerUrl}/preview/${usage.id}`;
    const websiteLink = `https://www.theguardian.com/${usage.id}`;

    return (
      <li className="usages-list__item" key={`usage-${i}`}>
        <p className="usages-list__item__name">{usage.fields.headline}</p>
        <div className="usages-list__links">
          <p className="usages-list__item__date">Created: {distanceInWordsToNow(usage.fields.creationDate, {addSuffix: true})}
          <a className="usages-list__link" href={websiteLink} title="Open on theguardian.com" target="_blank">
            <FrontendIcon />
          </a>
          <a className="usages-list__link" href={composerLink} title="Open in Composer" target="_blank">
            <ComposerIcon />
          </a>
          <a className="usages-list__link" href={viewerLink} title="Open in Viewer" target="_blank">
            <ViewerIcon />
          </a></p>
        </div>
      </li>
    );
  }

  renderAtomUsages = () => {
    if(this.props.atomUsages) {
      return (
        <ul className="usages-list">
          {this.props.atomUsages.map((usage, i) => this.renderAtomUsage(usage, i))}
        </ul>
      );
    }
  }

  render() {
    return (
      <div className="atom-editor">
        <h1 className="atom-editor__title">{this.props.atom ? this.props.atom.title : ''}</h1>
        <div className="atom-editor__section">
          {this.renderAtomDetails()}
        </div>
        <h2>Usages</h2>
        <div className="atom-editor__section">
          {this.renderAtomUsages()}
        </div>
      </div>
    );
  }
}


//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getAtomUsagesActions from '../../actions/AtomActions/getAtomUsages.js';

function mapStateToProps(state) {
  return {
    atom: state.atom,
    atomUsages: state.atomUsages,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, getAtomUsagesActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomStats);
