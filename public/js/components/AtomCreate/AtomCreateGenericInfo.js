import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {getAtomByType} from '../../constants/atomData';
import {AtomTypeCard} from '../AtomTypeCard/AtomTypeCard.js';
import FormFieldTextInput from '../FormFields/FormFieldTextInput';

class AtomCreateGenericInfo extends React.Component {

  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.String
    }).isRequired,
    atomActions: PropTypes.shape({
      createAtom: PropTypes.func.isRequired
    }).isRequired
  }

  state = {
    title: ""
  }

  updateTitle = (newTitle) => {
    this.setState({
      title: newTitle
    });
  }

  triggerAtomCreate = (e) => {
    e.preventDefault();

    this.props.atomActions.createAtom(this.props.routeParams.atomType, {
      title: this.state.title
    });
  }

  shouldEnableCreateButton = () => {
    if (!this.state.title || !this.state.title.length) {
      return false;
    }

    return true;
  }

  render () {

    const atomType = getAtomByType(this.props.routeParams.atomType);

    if (!atomType) {
      return <div>Unrecognised Atom Type</div>;
    }

    return (
      <div className="atom-editor">
        <h1 className="atom-editor__title">{`Create new ${this.props.routeParams.atomType}`}</h1>
        <div className="atom-editor__section">
          <AtomTypeCard atomType={atomType} />
          <Link className="link" to="/create">Select different atom</Link>
        </div>
          <form className="form">
            <FormFieldTextInput
              fieldLabel="Title"
              fieldName="title"
              fieldValue={this.state.title}
              fieldPlaceholder="Enter a title for this atom"
              onUpdateField={this.updateTitle}
            />
            <button className="btn" type="submit" disabled={!this.shouldEnableCreateButton()} onClick={this.triggerAtomCreate}>Create Atom</button>
          </form>
      </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as createAtomActions from '../../actions/AtomActions/createAtom.js';

function mapStateToProps(state) {
  return {
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, createAtomActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomCreateGenericInfo);
