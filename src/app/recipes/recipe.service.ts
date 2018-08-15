import { EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();
  activeRecipeItem: Recipe;
  private recipes: Recipe[] = [
    new Recipe(
      'Chicken Inasal',
      'This is the recipe',
      'https://images.summitmedia-digital.com/yummyph/images/04-2013_recipes/04-2013_yummy-ph_recipe_image_sari-jorges-chicken-inasal_main.jpg',
      [new Ingredient('Chicken', 1), new Ingredient('Garlic', 20)]
    ),
    new Recipe(
      'Chicken Tikka',
      'This is the recipe',
      'http://assets.kraftfoods.com/recipe_images/opendeploy/173356_640x428.jpg',
      [new Ingredient('Chicken', 2), new Ingredient('Pepper', 20)]
    )
  ];

  getRecipes() {
    // Return as a new Recipe array
    return this.recipes.slice();
  }

  setActiveRecipeItem(recipe: Recipe) {
    this.activeRecipeItem = recipe;
  }
}
