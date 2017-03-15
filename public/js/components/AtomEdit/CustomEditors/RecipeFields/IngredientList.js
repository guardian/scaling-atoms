import React, { PropTypes } from 'react';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import {Ingredient} from './Ingredient';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import FormFieldArrayWrapper from '../../../FormFields/FormFieldArrayWrapper';

export class IngredientList extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      title: PropTypes.string,
      ingredients: PropTypes.array
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func
  };

  render () {
    return (
      <div>
        <ManagedForm data={this.props.fieldValue} updateData={this.props.onUpdateField}>
          <ManagedField fieldLocation="title" name="Ingredients List Title (e.g. for the filling)">
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="ingredients" name="Ingredients">
            <FormFieldArrayWrapper nested="true">
              <Ingredient />
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
