import React, {PropTypes} from 'react';
import {atomPropType} from '../../constants/atomPropType.js';
import {getTitleForAtom, getAtomEditorUrl} from '../../util/atomDataExtractors';
import _capitalize from 'lodash/fp/capitalize';

class AtomLink extends React.Component {
  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }),
    externalAtom: atomPropType,
    externalAtomActions: PropTypes.shape({
      getExternalAtom: PropTypes.func.isRequired
    })
  }

  componentWillMount() {
      this.props.externalAtomActions.getExternalAtom(this.props.routeParams.atomType, this.props.routeParams.id);
  }

  renderEditorLink = (atom) => {
    const title = getTitleForAtom(atom);
    return (
      <div>
        <h1 className="h2">The atom &ldquo;{title}&rdquo; is not managed in the atom workshop</h1>
        <p className="h3">
          Edit this atom in the <a target="_blank" href={getAtomEditorUrl(atom)} className="link">{_capitalize(atom.atomType)} atom editor</a>
        </p>
      </div>
    );
  }

  render () {

    if(!this.props.externalAtom) {
      return (
        <div className="page__section page__section--centered">
          <p>Loading...</p>
        </div>
      );
    }

    return (
      <div className="page__section page__section--centered">
        {this.renderEditorLink(this.props.externalAtom)}
      </div>
    );

  }
}


//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as externalAtomActions from '../../actions/ExternalAtomActions/getExternalAtom';

function mapStateToProps(state) {
    return {
        externalAtom: state.externalAtom
    };
}

function mapDispatchToProps(dispatch) {
    return {
        externalAtomActions: bindActionCreators(Object.assign({}, externalAtomActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomLink);
