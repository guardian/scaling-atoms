import React, { PropTypes } from 'react';

import {allAtomTypes} from '../../constants/atomData';
import {atomTitleExtractor} from '../../util/atomTitleExtractor';
import publishState from '../../util/publishState';
import {supportedAtomTypes} from '../../constants/atomData';
import {ManagedField} from '../ManagedEditor';
import FormFieldTextInput from '../FormFields/FormFieldTextInput';
import FormFieldCheckboxGroup from '../FormFields/FormFieldCheckboxGroup';
import FormFieldSelectBox from '../FormFields/FormFieldSelectBox';
import {Link} from 'react-router';

class AtomList extends React.Component {

    static propTypes = {
        config: PropTypes.shape({
            atomEditorUrls: PropTypes.shape({
                explainer: PropTypes.string,
                media: PropTypes.string
            })
        }),
        atomListActions: PropTypes.shape({
            getAtomList: PropTypes.func.isRequired
        }).isRequired,
        atomList: PropTypes.array
    };
    
    state = {
        params: {
            types:[],
            "page-size": "20",
            q: "",
            searchFields: "data.title,data.label,title,labels,data.body"
        }
    };
    
    componentWillMount() {
        this.props.atomListActions.getAtomList(this.state.params);
    }

    updateAtomList = (newParams) => {
        this.setState({
            params: newParams
        }, () => this.props.atomListActions.getAtomList(this.state.params));
    };

    getUserString = (changeRecord) => {
        if (!changeRecord || !changeRecord.user) return 'unknown';
        if (!changeRecord.user.firstName || !changeRecord.user.lastName) return changeRecord.user.email;
        return `${changeRecord.user.firstName} ${changeRecord.user.lastName}`;
    };

    getDateString = (changeRecord) => {
        if (!changeRecord) return 'unknown';
        const date = new Date(changeRecord.date);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString('en-GB', {formatMatcher: "basic"})}`;
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
            switch(atom.atomType) {
                case ("explainer"): return `${editorUrls.explainer}/explain/${atom.id}`;
                case ("media"): return `${editorUrls.media}/videos/${atom.id}`;
            }
        }

        return <a target="_blank"
                  href={externalEditorUrl(this.props.config.atomEditorUrls)}
                  className="atom-list__link atom-list__editor-link">
                {title}</a>;
    };

    render () {

        if (!this.props.atomList) {
            return <div>Loading...</div>;
        }

        return (
            <div className="page__section">
                <h1 className="page__subheading">Atom Finder</h1>
                <div className="atom-list-filters">
                    <form className="form atom-list-filters">
                        <div className="atom-list-filters__search-box">
                            <ManagedField data={this.state.params} updateData={this.updateAtomList} fieldLocation="q" name="Search:">
                                <FormFieldTextInput/>
                            </ManagedField>
                        </div>
                        <div className="atom-list-filters__types-filter">
                            <ManagedField data={this.state.params}
                                          updateData={this.updateAtomList}
                                          fieldLocation="types"
                                          name="Atom Types:">
                                <FormFieldCheckboxGroup
                                    fieldLabel="Atom Types:"
                                    fieldName="Atom Types"
                                    fieldValue={[]}
                                    checkValues={allAtomTypes.map((t)=>t.type)}/>
                            </ManagedField>
                        </div>
                        <div className="atom-list-filters__page-size">
                            <ManagedField data={this.state.params} updateData={this.updateAtomList} fieldLocation="page-size" name="Page size:">
                                <FormFieldSelectBox selectValues={["20","50","100","150","200"]}/>
                            </ManagedField>
                        </div>
                    </form>
                </div>
                <div className="atom-list">
                    <table className="atom-list__table">
                        <thead>
                            <tr className="atom-list__header-row">
                                <th className="atom-list__header">Title</th>
                                <th className="atom-list__header">Type</th>
                                <th className="atom-list__header">Last Modified</th>
                                <th className="atom-list__header">Created by</th>
                                <th className="atom-list__header">Publication status</th>
                                <th className="atom-list__header"> </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.atomList.map((atom) => (
                            <tr className="atom-list__row" key={atom.id}>
                                <td className="atom-list__item">
                                    {this.renderEditorLink(atom)}
                                </td>
                                <td className="atom-list__item">{atom.atomType}</td>
                                <td className="atom-list__item">{this.getDateString(atom.contentChangeDetails.lastModified)}</td>
                                <td className="atom-list__item">
                                    {this.getUserString(atom.contentChangeDetails.created)}
                                </td>
                                <td className="atom-list__item">{publishState(atom).text}</td>
                                <td className="atom-list__item">
                                    <Link to={`/atoms/${atom.atomType}/${atom.id}/stats`} className="atom-list__link " key={atom.id}>
                                        Atom stats
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}


//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getAtomListActions from '../../actions/AtomListActions/getAtomList';

function mapStateToProps(state) {
    return {
        atomList: state.atomList,
        config: state.config
    };
}

function mapDispatchToProps(dispatch) {
    return {
        atomListActions: bindActionCreators(Object.assign({}, getAtomListActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomList);