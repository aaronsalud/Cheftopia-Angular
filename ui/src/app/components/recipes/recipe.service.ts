import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RecipeService {
  recipesUpdated = new Subject<Recipe[]>();
  constructor(
    private shoppingListService: ShoppingListService,
    private http: HttpClient
  ) {}

  private recipes: Recipe[];

  getRecipes() {
    this.http.get('/api/recipe').subscribe(
      (recipes: any) => {
        this.recipes = [];
        recipes.forEach((recipe: any) => {
          if (recipe) {
            const ingredients = [];
            if (recipe.ingredients && recipe.ingredients.length > 0) {
              recipe.ingredients.forEach(ingredient =>
                ingredients.push(this.generateIngredient(ingredient))
              );
            }
            this.recipes.push(this.generateRecipe(recipe, ingredients));
            this.recipesUpdated.next(this.recipes.slice());
          }
        });
      },
      err => console.log(err)
    );
  }

  private generateIngredient(ingredient) {
    return new Ingredient(ingredient.id, ingredient.name, ingredient.amount);
  }

  private generateRecipe(recipe, ingredients) {
    return new Recipe(
      recipe.id,
      recipe.name,
      recipe.description,
      recipe.image,
      ingredients
    );
  }

  getRecipeById(id: number) {
    return this.recipes && this.recipes.length > 0
      ? this.recipes.filter((recipe: Recipe) => recipe.id === id)[0]
      : null;
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
