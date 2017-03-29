import React, {PropTypes} from 'react';
import {ManagedForm, ManagedField} from '../../ManagedEditor';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import FormFieldsScribeEditor from '../../FormFields/FormFieldScribeEditor';
import {ExplainerDisplayTypes} from './ExplainerFields/DisplayTypes';

export class ExplainerEditor extends React.Component {

  static propTypes = {
    atom: PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.string
    }).isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func
  }

  render() {
    return (
      <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="explainerEditor">
        <ManagedField fieldLocation="data.explainer.title" name="Explainer Title" isRequired={true}>
          <FormFieldTextInput />
        </ManagedField>
        <ManagedField fieldLocation="data.explainer.body" name="Body">
          <FormFieldsScribeEditor showWordCount={true} suggestedLength={100}/>
        </ManagedField>
        <ManagedField fieldLocation="data.explainer.displayType" name="Display type">
          <ExplainerDisplayTypes />
        </ManagedField>
      </ManagedForm>
    );
  }
}
