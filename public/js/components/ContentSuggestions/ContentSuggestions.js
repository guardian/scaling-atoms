import React, {PropTypes} from 'react';
import CopyUrlButton from './CopyUrlButton';
import {FrontendIcon, ComposerIcon, ViewerIcon} from '../../util/icons.js';
import {SuggestedContentPropType} from '../../actions/AtomActions/getSuggestionsForLatestContent.js';

const SupportedAtomTypes = ["PROFILE", "QANDA", "TIMELINE", "GUIDE"];

class ContentSuggestions extends React.Component {

  static propTypes = {
    suggestionsForLatestContent: PropTypes.arrayOf(SuggestedContentPropType),
    atomActions: PropTypes.shape({
      getSuggestionsForLatestContent: PropTypes.func.isRequired
    }).isRequired,
    config: PropTypes.shape({
      composerUrl: PropTypes.string.isRequired,
      viewerUrl: PropTypes.string.isRequired,
      liveCapiUrl: PropTypes.string
    }).isRequired
  }

  componentWillMount() {
    this.props.atomActions.getSuggestionsForLatestContent();
  }

  renderAtom = atom => {
    return (
      <div className="suggestions-atom">
        <span className="suggestions-atom-title">{ atom.title }</span>
        <span className="suggestions-atom-type">({ atom.atomType.charAt(0) + atom.atomType.slice(1).toLowerCase() } atom)</span>
        <CopyUrlButton config={this.props.config} atom={atom}/>
      </div>
    );
  }

  alreadyHasAtom = (content, atomId) => {
    const idx = SupportedAtomTypes.findIndex(atomType => {
      const key = `${atomType.toLowerCase()}s`;
      return (content.atoms[key] && content.atoms[key].findIndex(atom => atom.id === atomId) > -1);
    });

    return idx > -1;
  }

  renderContent = (content, atomId) => {
    if (!this.alreadyHasAtom(content, atomId)) {
      const composerLink = `${this.props.config.composerUrl}/content/${content.internalComposerCode}`;
      const viewerLink = `${this.props.config.viewerUrl}/preview/${content.id}`;
      const websiteLink = `https://www.theguardian.com/${content.id}`;

      return (
        <li className="suggestions-content">
          <div className="suggestions-headline">
            <h4 className="suggestions-list__item__name">{content.headline}</h4>
          </div>
          <div className="suggestions-list__links">
            <p className="suggestions-list__item__date">
              <a className="suggestions-list__link" href={websiteLink} title="Open on theguardian.com" target="_blank">
                <FrontendIcon />
              </a>
              <a className="suggestions-list__link" href={composerLink} title="Open in Composer" target="_blank">
                <ComposerIcon />
              </a>
              <a className="suggestions-list__link" href={viewerLink} title="Open in Viewer" target="_blank">
                <ViewerIcon />
              </a></p>
          </div>
        </li>
      );
    }
  }

  renderContentArray = (contentArray, atomId) => {
    return (
      <div className="suggestions-content-container">
        <div className="suggestions-content-container-heading">Suggestions from the last 24 hours:</div>
        <ul className="suggestions-list">
          {contentArray.map(content => this.renderContent(content, atomId))}
        </ul>
      </div>
    );
  }

  renderContentAndSuggestions = (item, i) => {
    if (SupportedAtomTypes.indexOf(item.atom.atomType) > -1) {
      return (
        <li className="suggestions-list__item" key={`usage-${i}`}>
          { this.renderAtom(item.atom) }
          { this.renderContentArray(item.content, item.atom.id) }
        </li>
      );
    }
  }

  renderSuggestionsForLatestContent() {
    if (this.props.suggestionsForLatestContent) {
      return (
        <ul className="suggestions-list">
          { this.props.suggestionsForLatestContent.map((item, i) => this.renderContentAndSuggestions(item, i)) }
        </ul>
      );
    } else {
      return (
        <div>Loading content suggestions for the last 24 hours...</div>
      );
    }
  }

  render() {
    return (
      <div className="atom-editor suggestions-container">
        {this.renderSuggestionsForLatestContent()}
      </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getSuggestionsForLatestContent from '../../actions/AtomActions/getSuggestionsForLatestContent.js';

function mapStateToProps(state) {
  return {
    suggestionsForLatestContent: state.suggestionsForLatestContent,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, getSuggestionsForLatestContent), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentSuggestions);
