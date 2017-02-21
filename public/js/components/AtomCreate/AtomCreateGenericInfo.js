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

  triggerAtomCreate = () => {
    this.props.atomActions.createAtom(this.props.routeParams.atomType);
  }

  render () {

    const atomType = getAtomByType(this.props.routeParams.atomType);

    if (!atomType) {
      return <div>Unrecognised Atom Type</div>;
    }

    return (
      <div className="create">
        <h1>{`Create new ${this.props.routeParams.atomType}`}</h1>
        <div>
          <AtomTypeCard atomType={atomType} />
        </div>
        <Link to="/create">Select different atom</Link>
          <form className="form">
            <div className="create__form">
              <FormFieldTextInput
                fieldLabel="Title"
                fieldName="title"
                fieldValue={this.state.title}
                fieldPlaceholder="Enter a title for this atom"
                onUpdateField={this.updateTitle}
              />
            </div>
            <div className="create__buttons">
              <button className="btn" type="button" onClick={this.triggerAtomCreate}>Create Atom</button>
            </div>
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
