import React, {PropTypes} from 'react';
import CopyUrlButton from './CopyUrlButton';
import {FrontendIcon, ComposerIcon, ViewerIcon} from '../../util/icons.js';

class ContentSuggestions extends React.Component {

  static propTypes = {
    suggestionsForLatestContent: PropTypes.array,
    atomActions: PropTypes.shape({
      getSuggestionsForLatestContent: PropTypes.func.isRequired
    }).isRequired,
    config: PropTypes.shape({
      composerUrl: PropTypes.string.isRequired,
      viewerUrl: PropTypes.string.isRequired,
      liveCapiUrl: PropTypes.string
    }).isRequired
  }

  /**
   * get all content from past 24 hours with tone/news
   * foreach content
   *   get atom suggestions from targeting for all keyword tags on content
   *   filter out any atoms already on this content
   *
   * var suggestions = [
   *   {
   *     "id": "",
   *     "headline": "",
   *     "internalComposerCode": "",
   *     "atoms": [
   *       {
   *         "id": "",
   *         "title": "",
   *         "atomType": ""
   *       }
   *     ]
   *   }
   * ]
   *
   * foreach content in suggestions
   *   <div>
   *     <h3>headline</h3>
   *     links...
   *     <ul>
   *       foreach atom:
   *       <li>atom title / copy-able link</li>
   *     </ul>
   *   </div
   */

  componentWillMount() {
    this.props.atomActions.getSuggestionsForLatestContent();
  }

  renderAtom = (atom, i) => {
    return (
      <li key={`atom-${i}`}>
        <span className="suggestions-atom-title">{ atom.title }</span>
        <span className="suggestions-atom-type">({ atom.atomType.charAt(0) + atom.atomType.slice(1).toLowerCase() })</span>
        <CopyUrlButton config={this.props.config} atom={atom}/>
      </li>
    );
  }

  renderAtoms = (atoms) => {
    return (
      <div className="suggestions-atoms">
        <ul className="suggestions-list">
          { atoms.map((atom, i) => this.renderAtom(atom, i)) }
        </ul>
      </div>
    );
  }

  renderContent = (item) => {
    const composerLink = `${this.props.config.composerUrl}/content/${item.internalComposerCode}`;
    const viewerLink = `${this.props.config.viewerUrl}/preview/${item.id}`;
    const websiteLink = `https://www.theguardian.com/${item.id}`;

    return (
      <div className="suggestions-content">
        <h3 className="suggestions-list__item__name">{item.headline}</h3>
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
      </div>
    );
  }

  renderContentAndSuggestions = (item, i) => {
    if (item.headline) {
      return (
        <li className="suggestions-list__item" key={`usage-${i}`}>
          { this.renderContent(item) }
          { this.renderAtoms(item.atoms) }
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
