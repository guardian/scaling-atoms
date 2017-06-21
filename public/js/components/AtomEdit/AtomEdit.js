import React, { PropTypes } from 'react';
import {CTAEditor} from './CustomEditors/CTAEditor';
import {RecipeEditor} from './CustomEditors/RecipeEditor';
import {ExplainerEditor} from './CustomEditors/ExplainerEditor';
import {StoryQuestionsEditor} from './CustomEditors/StoryQuestionsEditor';
import {QAndAEditor} from './CustomEditors/QAndAEditor';
import {GuideEditor} from './CustomEditors/GuideEditor';
import {ProfileEditor} from './CustomEditors/ProfileEditor';
import {TimelineEditor} from './CustomEditors/TimelineEditor';
import EmbeddedAtomPick from './EmbeddedAtomPick';

import {subscribeToPresence, enterPresence} from '../../services/presence';

import AtomEditHeader from './AtomEditHeader';
import {atomPropType} from '../../constants/atomPropType';

class AtomEdit extends React.Component {

  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    atomActions: PropTypes.shape({
      updateAtom: PropTypes.func.isRequired,
      publishAtom: PropTypes.func.isRequired
    }).isRequired,
    formErrorActions: PropTypes.shape({
      updateFormErrors: PropTypes.func
    }),
    atom: atomPropType,
    config: PropTypes.shape({
      gridUrl: PropTypes.string,
      embeddedMode: PropTypes.string,
      isEmbedded: PropTypes.bool.isRequired
    })
  }

  componentWillMount() {
    subscribeToPresence(this.props.routeParams.atomType, this.props.routeParams.id);
  }

  updateAtom = (newAtom) => {
    this.props.atomActions.updateAtom(newAtom);
    enterPresence(this.props.routeParams.atomType, this.props.routeParams.id);
  }

  updateFormErrors = (errors) => {
    this.props.formErrorActions.updateFormErrors(errors);
  }

  renderSpecificEditor () {

    //TODO: This is brittle, can we improve?
    const atomType = this.props.atom.atomType.toLowerCase();

    switch (atomType) {
      case ("cta"):
        return <CTAEditor atom={this.props.atom} onUpdate={this.updateAtom} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("recipe"):
        return <RecipeEditor atom={this.props.atom} onUpdate={this.updateAtom} config={this.props.config} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("explainer"):
        return <ExplainerEditor atom={this.props.atom} onUpdate={this.updateAtom} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("storyquestions"):
        return <StoryQuestionsEditor atom={this.props.atom} onUpdate={this.updateAtom} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("qanda"):
        return <QAndAEditor atom={this.props.atom} onUpdate={this.updateAtom} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("guide"):
        return <GuideEditor atom={this.props.atom} onUpdate={this.updateAtom} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("profile"):
        return <ProfileEditor atom={this.props.atom} onUpdate={this.updateAtom} config={this.props.config} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("timeline"):
        return <TimelineEditor atom={this.props.atom} onUpdate={this.updateAtom} onFormErrorsUpdate={this.updateFormErrors} />;
      default:
        return (
          <div>Atom Workshop cannot edit this type of atom currently</div>
        );
    }
  }

  renderEmbeddedCreate() {
    if (!this.props.config.isEmbedded || this.props.config.embeddedMode !== "browse") {
      return false;
    }

    return <EmbeddedAtomPick atom={this.props.atom} publishAtom={this.props.atomActions.publishAtom}/>;
  }

  render() {
    if (!this.props.atom) {
      return <div>Loading...</div>;
    }

    return (
        <div className="atom-editor">
          {this.renderEmbeddedCreate()}
          <AtomEditHeader atom={this.props.atom} onUpdate={this.updateAtom}/>
          <form className="atom-editor__form">
            {this.renderSpecificEditor()}
          </form>
        </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as updateAtomActions from '../../actions/AtomActions/updateAtom.js';
import * as publishAtomActions from '../../actions/AtomActions/publishAtom.js';
import * as updateFormErrors from '../../actions/FormErrorActions/updateFormErrors.js';

function mapStateToProps(state) {
  return {
    config: state.config,
    atom: state.atom,
    presence: state.presence,
    formErrors: state.formErrors
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, updateAtomActions, publishAtomActions), dispatch),
    formErrorActions: bindActionCreators(Object.assign({}, updateFormErrors), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomEdit);
