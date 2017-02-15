import React, { PropTypes } from 'react';

const atomPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  atomType: PropTypes.string.isRequired,
  labels: PropTypes.array.isRequired,
  defaultHtml: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
});

class AtomEdit extends React.Component {

  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    atomActions: PropTypes.shape({
      getAtom: PropTypes.func.isRequired,
      updateAtom: PropTypes.func.isRequired
    }).isRequired,
    atom: atomPropType
  }

  componentWillMount() {
    this.props.atomActions.getAtom(this.props.routeParams.atomType, this.props.routeParams.id);
  }

  updateAtom = () => {
    this.props.atomActions.updateAtom(this.props.atom);
  }

  render () {
    return (
      <dev>
        <p>Editing atom: </p>
        <button className="btn" type="button" onClick={this.updateAtom}>Update atom</button>
      </dev>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getAtomActions from '../../actions/AtomActions/getAtom.js';
import * as updateAtomActions from '../../actions/AtomActions/updateAtom.js';

function mapStateToProps(state) {
  return {
    config: state.config,
    atom: state.atom
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, updateAtomActions, getAtomActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomEdit);
