import React, { PropTypes } from 'react';
import {atomPropType} from '../../constants/atomPropType.js';
import {atomTitleExtractor} from '../../util/atomTitleExtractor';
import publishState from '../../util/publishState';
import {supportedAtomTypes} from '../../constants/atomData';
import format from 'date-fns/format';
import {Link} from 'react-router';

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
        return format(date, 'DD/MM/YYYY HH:mm');
    };

    renderEditorLink = (atom) => {
        const title = atomTitleExtractor(atom);
        if (supportedAtomTypes.map((t)=>t.type).indexOf(atom.atomType) !== -1) {
            return <Link to={`/atoms/${atom.atomType}/${atom.id}/edit`}
                         className="atom-list__link atom-list__editor-link"
                         key={atom.id}>
                {title}</Link>;
        }
        function externalEditorUrl(editorUrls) {
            switch (atom.atomType) {
                case ("explainer"):
                    return `${editorUrls.explainer}/explain/${atom.id}`;
                case ("media"):
                    return `${editorUrls.media}/videos/${atom.id}`;
            }
        }

        return <a target="_blank"
                  href={externalEditorUrl(this.props.config.atomEditorUrls)}
                  className="atom-list__link atom-list__editor-link">
            {title}</a>;
    };

    render () {
        return <tr className="atom-list__row" key={this.props.atom.id}>
            <td className="atom-list__item">
                {this.renderEditorLink(this.props.atom)}
            </td>
            <td className="atom-list__item">{this.props.atom.atomType}</td>
            <td className="atom-list__item">{this.getDateString(this.props.atom.contentChangeDetails.lastModified)}</td>
            <td className="atom-list__item">
                {this.getUserString(this.props.atom.contentChangeDetails.created)}
            </td>
            <td className="atom-list__item">{publishState(this.props.atom).text}</td>
            <td className="atom-list__item">
                <Link to={`/atoms/${this.props.atom.atomType}/${this.props.atom.id}/stats`} className="atom-list__link " key={this.props.atom.id}>
                    Atom stats
                </Link>
            </td>
        </tr>;
    }
}