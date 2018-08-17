import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { EventEmitter } from 'protractor';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipesUpdated = new Subject<Recipe[]>();
  constructor(private shoppingListService: ShoppingListService) {}

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

  getRecipeByIndex(id: number) {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesUpdated.next(this.recipes.slice());
  }

  editRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesUpdated.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesUpdated.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
