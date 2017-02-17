import React, {PropTypes} from 'react';
import {ManagedForm, ManagedField} from '../../ManagedEditor';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import FormFieldsScribeEditor from '../../FormFields/FormFieldScribeEditor';
import {ExplainerDisplayTypes} from './ExplainerFields/DisplayTypes';

export class ExplainerEditor extends React.Component {

  static propTypes = {
    atom: PropTypes.shape({
      type: PropTypes.string
    }).isRequired,
    onUpdate: PropTypes.func.isRequired
  }

  render() {
    return (
      <div className="editor editor-explainer">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate}>
          <ManagedField fieldLocation="data.title" name="Title" isRequired={true}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="data.body" name="Body">
            <FormFieldsScribeEditor />
          </ManagedField>
          <ManagedField fieldLocation="data.displayType" name="Display type">
            <ExplainerDisplayTypes />
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
