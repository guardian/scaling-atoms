import React, { PropTypes } from 'react';

import {ManagedForm, ManagedField} from '../../ManagedEditor';
import FormFieldNumericInput from '../../FormFields/FormFieldNumericInput';
import FormFieldArrayWrapper from '../../FormFields/FormFieldArrayWrapper';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import FormFieldImageSelect from '../../FormFields/FormFieldImageSelect';
import FormFieldMultiSelect from '../../FormFields/FormFieldMultiSelect';
import {RecipeServings} from './RecipeFields/Servings';
import {IngredientList} from './RecipeFields/IngredientList';
import * as recipeData from '../../../constants/recipeData';

export class RecipeEditor extends React.Component {

  static propTypes = {
    atom: PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.string
    }).isRequired,
    onUpdate: PropTypes.func.isRequired,
    config: PropTypes.shape({
      gridUrl: PropTypes.string.isRequired
    }).isRequired
  }

  render () {
    return (
      <ManagedForm data={this.props.atom} updateData={this.props.onUpdate}>

        <ManagedField fieldLocation="data.recipe.tags.cuisine" name="Cuisine">
          <FormFieldMultiSelect selectValues={recipeData.cuisineList}/>
        </ManagedField>
        <ManagedField fieldLocation="data.recipe.tags.category" name="Category">
          <FormFieldMultiSelect selectValues={recipeData.categoryList}/>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.tags.celebration" name="Celebration">
          <FormFieldMultiSelect selectValues={recipeData.celebrationList}/>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.tags.dietary" name="Dietary info">
          <FormFieldMultiSelect selectValues={recipeData.dietaryList}/>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.time.preparation" name="Preparation Time (mins)">
          <FormFieldNumericInput/>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.time.cooking" name="Cooking Time (mins)">
          <FormFieldNumericInput/>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.serves" name="Serving Information">
          <RecipeServings />
        </ManagedField>
        <ManagedField fieldLocation="data.recipe.ingredientsLists" name="Ingredient Lists">
          <FormFieldArrayWrapper>
            <IngredientList />
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
