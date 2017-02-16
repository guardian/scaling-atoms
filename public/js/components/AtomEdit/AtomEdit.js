import React, { PropTypes } from 'react';
import {CTAEditor} from './CustomEditors/CTAEditor';
import {RecipeEditor} from './CustomEditors/RecipeEditor';
import {ExplainerEditor} from './CustomEditors/ExplainerEditor';

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

  updateAtom = (newAtom) => {
    this.props.atomActions.updateAtom(newAtom);
  }

  render () {

    if (!this.props.atom) {
      return <div>Loading...</div>;
    }

    //TODO: This is brittle, can we improve?
    const atomType = this.props.atom.atomType.toLowerCase();

    switch (atomType) {
      case ("cta"):
        return <CTAEditor atom={this.props.atom} onUpdate={this.updateAtom}/>;
      case ("recipe"):
        return <RecipeEditor atom={this.props.atom} onUpdate={this.updateAtom}/>;
      case ("explainer"):
        return <ExplainerEditor atom={this.props.atom} onUpdate={this.updateAtom}/>;
      default:
        return (
          <div>Atom Workshop cannot edit this type of atom currently</div>
        );
    }
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
