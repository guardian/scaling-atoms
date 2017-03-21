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

  render () {
    if(!this.props.externalAtom) {
      return (
        <p>Loading...</p>
      );
    }

    const title = getTitleForAtom(this.props.externalAtom);
    return (
      <a target="_blank"
        href={getAtomEditorUrl(this.props.externalAtom)}
        className="atom-list__link atom-list__editor-link">
        {_capitalize(this.props.externalAtom.atomType)} - {title}
      </a>
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
