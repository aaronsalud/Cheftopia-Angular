import { Recipe } from '../../components/recipes/recipe.model';

// Set Active Recipe State
export class SetRecipe {
  static readonly type = '[RECIPE] Set Active Recipe';
  constructor(public recipe: Recipe) {}
}

// Set Recipes State
export class SetRecipes {
  static readonly type = '[RECIPE] Set Recipes';
  constructor(public payload: Recipe[]) {}
}

// Set Loading State
export class RecipeLoading {
  static readonly type = '[Recipe] Loading';
  constructor() {}
}
