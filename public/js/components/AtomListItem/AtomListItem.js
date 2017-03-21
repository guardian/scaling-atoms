import React, { PropTypes } from 'react';
import {atomPropType} from '../../constants/atomPropType.js';
import {getTitleForAtom, isAtomWorkshopEditable} from '../../util/atomDataExtractors';
import publishState from '../../util/publishState';
import {Link} from 'react-router';
import _capitalize from 'lodash/fp/capitalize';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

export default class AtomListItem extends React.Component {

    static propTypes = {
        config: PropTypes.shape({
            atomEditorUrls: PropTypes.shape({
                explainer: PropTypes.string,
                media: PropTypes.string
            })
        }),
        atom: atomPropType
    };

    getUserString = (changeRecord) => {
        if (!changeRecord || !changeRecord.user) return 'unknown';
        if (!changeRecord.user.firstName || !changeRecord.user.lastName) return changeRecord.user.email;
        return `${changeRecord.user.firstName} ${changeRecord.user.lastName}`;
    };

    getDateString = (changeRecord) => {
        if (!changeRecord) return 'unknown';
        const date = new Date(changeRecord.date);
        return distanceInWordsToNow(date);
    };

    renderEditorLink = (atom) => {
        const title = getTitleForAtom(atom);
        if (isAtomWorkshopEditable(atom)) {
            return (
              <Link to={`/atoms/${atom.atomType}/${atom.id}/edit`}
                className="atom-list__link atom-list__editor-link"
                key={atom.id}>
                {_capitalize(atom.atomType)} - {title}
              </Link>
            );
        }

        return (
          <Link to={`/external-atoms/${atom.atomType}/${atom.id}/link`}
            className="atom-list__link atom-list__editor-link"
            key={atom.id}>
            {_capitalize(atom.atomType)} - {title}
          </Link>
        );
    };

    render () {
        return (
          <div className="atom-list__item">
            <img className="atom-list__item__icon" src={`/assets/images/typeicons/${this.props.atom.atomType.toLowerCase()}-icon.svg`} />
            <div className="atom-list__item__content">
              <div className="atom-list__title">
                {this.renderEditorLink(this.props.atom)}
              </div>
              <div>
                <span className="bold">{publishState(this.props.atom).text} </span>
                Last modified {this.getDateString(this.props.atom.contentChangeDetails.lastModified)} ago
                <Link to={`/atoms/${this.props.atom.atomType}/${this.props.atom.id}/stats`} className="atom-list__link " key={this.props.atom.id}>
                    <img className="atom-list__icon" src="/assets/images/stats-icon.svg"/>
                </Link>
              </div>
            </div>
          </div>
        );
    }
}
