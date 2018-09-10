import { State, Action, StateContext } from '@ngxs/store';
import { Recipe } from '../../components/recipes/recipe.model';
import {
  SetRecipe,
  SetRecipes,
  RecipeLoading
} from '../actions/recipe.actions';

export class RecipeStateModel {
  loading: boolean;
  recipes: Recipe[];
  recipe: Recipe;
}

@State<RecipeStateModel>({
  name: 'recipeDashboard',
  defaults: {
    loading: false,
    recipes: [],
    recipe: null
  }
})
export class RecipeState {
  @Action(SetRecipes)
  setRecipes(
    { patchState }: StateContext<RecipeStateModel>,
    { payload }: SetRecipes
  ) {
    patchState({
      loading: false,
      recipes: payload,
      recipe: null
    });
  }

  @Action(SetRecipe)
  setRecipe(
    { patchState }: StateContext<RecipeStateModel>,
    { recipe }: SetRecipe
  ) {
    patchState({
      loading: false,
      recipe
    });
  }

  @Action(RecipeLoading)
  recipeLoading({ patchState, getState }: StateContext<RecipeStateModel>) {
    const state = getState();
    patchState({
      loading: !state.loading
    });
  }
}
