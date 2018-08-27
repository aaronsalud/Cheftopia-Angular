import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class RecipeService {
  recipesUpdated = new Subject<Recipe[]>();
  recipeFormErrors = new Subject();
  route: ActivatedRoute;
  constructor(
    private shoppingListService: ShoppingListService,
    private http: HttpClient,
    private router: Router
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

  setCurrentRoute(currentRoute: ActivatedRoute) {
    this.route = currentRoute;
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
    this.http.post('/api/recipe', recipe).subscribe(
      (recipe: any) => {
        if (recipe) {
          const ingredients = [];
          if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach(ingredient =>
              ingredients.push(this.generateIngredient(ingredient))
            );
          }
          this.recipes.push(this.generateRecipe(recipe, ingredients));
          this.recipesUpdated.next(this.recipes.slice());
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      },
      err => this.recipeFormErrors.next(err)
    );
  }

  editRecipe(id: number, recipe: Recipe) {
    this.http.put(`/api/recipe/${id}`, recipe).subscribe(
      (recipe: any) => {
        if (recipe) {
          const ingredients = [];
          if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach(ingredient =>
              ingredients.push(this.generateIngredient(ingredient))
            );
          }

          const index = this.recipes.findIndex(
            recipeItem => recipeItem.id === recipe.id
          );
          this.recipes[index] = this.generateRecipe(recipe, ingredients);
          this.recipesUpdated.next(this.recipes.slice());
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      },
      err => this.recipeFormErrors.next(err)
    );
  }

  deleteRecipe(id: number) {
    this.http.delete(`/api/recipe/${id}`).subscribe(
      () => {
        const index = this.recipes.findIndex(
          recipeItem => recipeItem.id === id
        );
        this.recipes.splice(index, 1);
        this.recipesUpdated.next(this.recipes.slice());
        this.router.navigate(['/recipes']);
      },
      err => this.recipeFormErrors.next(err)
    );
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
