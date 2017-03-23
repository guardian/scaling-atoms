import React, { PropTypes } from 'react';

import {allAtomTypes} from '../../constants/atomData';
import {ManagedField} from '../ManagedEditor';
import SearchTextInput from '../FormFields/SearchFields/SearchTextInput';
import SearchCheckboxGroup from '../FormFields/SearchFields/SearchCheckboxGroup';
import SearchSelectBox from '../FormFields/SearchFields/SearchSelectBox';
import AtomListItem from '../AtomListItem/AtomListItem';


class AtomList extends React.Component {

  static propTypes = {
    config: PropTypes.shape({
      atomEditorUrls: PropTypes.shape({
        explainer: PropTypes.string,
        media: PropTypes.string
      }),
      isEmbedded: PropTypes.bool.isRequired
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


  render () {

    if (!this.props.atomList) {
      return <div>Loading...</div>;
    }

    return (
      <div className="page__section">

        <div className="atom-search">

          <ManagedField data={this.state.params} updateData={this.updateAtomList} fieldLocation="q" name="Search atoms">
            <SearchTextInput fieldPlaceholder="Search for atoms" />
          </ManagedField>

          <div className="atom-search__filters">
            <ManagedField data={this.state.params}
            updateData={this.updateAtomList}
            fieldLocation="types"
            name="Atom Types">
              <SearchCheckboxGroup checkValues={allAtomTypes.map((t)=>t.type)}/>
            </ManagedField>

            <ManagedField data={this.state.params} updateData={this.updateAtomList} fieldLocation="page-size" name="Page size">
              <SearchSelectBox selectValues={["20","50","100","150","200"]} />
            </ManagedField>
          </div>

        </div>

        <div className="atom-list">
          {this.props.atomList.map((atom) => <AtomListItem atom={atom} config={this.props.config} key={atom.id}/>)}
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
