import React, { PropTypes } from 'react';

import {ManagedForm, ManagedField} from '../../ManagedEditor';
import FormFieldNumericInput from '../../FormFields/FormFieldNumericInput';
import FormFieldArrayWrapper from '../../FormFields/FormFieldArrayWrapper';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import FormFieldImageSelect from '../../FormFields/FormFieldImageSelect';
import {RecipeServings} from './RecipeFields/Servings';
import {IngredientList} from './RecipeFields/IngredientList';

export class RecipeEditor extends React.Component {

  static propTypes = {
    atom: PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.string
    }).isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func,
    config: PropTypes.shape({
      gridUrl: PropTypes.string.isRequired
    }).isRequired
  }

  render () {

    return (
      <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="recipeEditor">
        <h3 className="form__subheading">Time</h3>
        <div className="form__flex-container">
          <div className="form__flex-container__item">
            <ManagedField fieldLocation="data.recipe.time.preparation" name="Preparation Time (mins)">
              <FormFieldNumericInput/>
            </ManagedField>
          </div>
          <div className="form__flex-container__item">
            <ManagedField fieldLocation="data.recipe.time.cooking" name="Cooking Time (mins)">
              <FormFieldNumericInput/>
            </ManagedField>
          </div>
        </div>
        <ManagedField fieldLocation="data.recipe.serves" name="Serving Information">
          <RecipeServings />
        </ManagedField>
        <ManagedField fieldLocation="data.recipe.ingredientsLists" name="Ingredient Lists">
          <FormFieldArrayWrapper>
            <IngredientList onFormErrorsUpdate={this.props.onFormErrorsUpdate} />
          </FormFieldArrayWrapper>
        </ManagedField>
        <ManagedField fieldLocation="data.recipe.steps" name="Steps">
          <FormFieldArrayWrapper numbered={true} fieldClass="form__group form__group--flex">
            <FormFieldTextInput />
          </FormFieldArrayWrapper>
        </ManagedField>
        <ManagedField fieldLocation="data.recipe.images" name="Images">
          <FormFieldArrayWrapper>
            <FormFieldImageSelect gridUrl={this.props.config.gridUrl}/>
          </FormFieldArrayWrapper>
        </ManagedField>
      </ManagedForm>
    );
  }
}
