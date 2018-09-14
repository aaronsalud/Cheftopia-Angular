import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  SetRecipes,
  RecipeLoading,
  SetRecipe
} from '../../store/actions/recipe.actions';
import { SetErrors } from '../../store/actions/errors.actions';

@Injectable()
export class RecipeService {
  recipesUpdated = new Subject<Recipe[]>();
  activeRecipe: Subject<Recipe> = new Subject();
  recipeFormErrors = new Subject();
  recipeLoading: Subject<boolean> = new Subject();
  recipes: Recipe[];
  recipe: Recipe;

  route: ActivatedRoute;
  constructor(
    // private shoppingListService: ShoppingListService,
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {
    this.store
      .select(state => state.recipeDashboard)
      .subscribe(({ recipes, loading, recipe }) => {
        if (recipes) {
          this.recipes = recipes;
          this.recipesUpdated.next(this.recipes);
        }
        if (recipe) {
          this.recipe = recipe;
          this.activeRecipe.next(this.recipe);
        }

        this.recipeLoading.next(loading);
      });
  }

  private generateIngredient(ingredient) {
    return new Ingredient(ingredient.id, ingredient.name, ingredient.amount);
  }

  private generateIngredients(recipeIngredients) {
    const ingredients = [];
    if (recipeIngredients && recipeIngredients.length > 0) {
      recipeIngredients.forEach(ingredient =>
        ingredients.push(this.generateIngredient(ingredient))
      );
    }
    return ingredients;
  }
  private generateRecipe(recipe) {
    let ingredients = [];
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      ingredients = this.generateIngredients(recipe.ingredients);
    }
    return new Recipe(
      recipe.id,
      recipe.name,
      recipe.description,
      recipe.image,
      ingredients
    );
  }

  setCurrentRoute(currentRoute: ActivatedRoute) {
    this.route = currentRoute;
  }

  getRecipeById(id: number) {
    const recipe =
      this.recipes && this.recipes.length > 0
        ? this.recipes.filter((recipe: Recipe) => recipe.id === id)[0]
        : null;

    this.store.dispatch(new SetRecipe(recipe));
  }

  // Fetch Recipes Method
  getRecipes() {
    this.store.dispatch(new RecipeLoading());
    this.http.get('/api/recipe').subscribe(
      (recipes: any) => {
        let recipeData = [];
        recipes.forEach((recipe: any) => {
          if (recipe) {
            recipeData.push(this.generateRecipe(recipe));
          }
        });
        this.store.dispatch(new SetRecipes(recipeData));
      },
      err => {
        this.store.dispatch(new RecipeLoading());
        this.store.dispatch(new SetErrors(err));
      }
    );
  }

  // Create Recipe Method
  addRecipe(recipe: Recipe) {
    this.store.dispatch(new RecipeLoading());
    this.http.post('/api/recipe', recipe).subscribe(
      (recipe: any) => {
        if (recipe) {
          let recipeData = this.recipes.slice();
          recipeData.push(this.generateRecipe(recipe));
          this.store.dispatch(new SetRecipes(recipeData));
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      },
      err => {
        this.store.dispatch(new RecipeLoading());
        this.recipeFormErrors.next(err);
      }
    );
  }

  // Update Recipe Method
  editRecipe(id: number, recipe: Recipe) {
    this.store.dispatch(new RecipeLoading());
    this.http.put(`/api/recipe/${id}`, recipe).subscribe(
      (recipe: any) => {
        if (recipe) {
          const index = this.recipes.findIndex(
            recipeItem => recipeItem.id === recipe.id
          );
          let recipeData = this.recipes.slice();
          recipeData[index] = this.generateRecipe(recipe);
          this.store.dispatch(new SetRecipes(recipeData));
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      },
      err => {
        this.store.dispatch(new RecipeLoading());
        this.recipeFormErrors.next(err);
      }
    );
  }

  // Delete Recipe Method
  deleteRecipe(id: number) {
    this.store.dispatch(new RecipeLoading());
    this.http.delete(`/api/recipe/${id}`).subscribe(
      () => {
        const index = this.recipes.findIndex(
          recipeItem => recipeItem.id === id
        );
        const recipeData = this.recipes.slice();
        recipeData.splice(index, 1);
        this.store.dispatch(new SetRecipes(recipeData));
        this.router.navigate(['/recipes']);
      },
      err => {
        this.store.dispatch(new RecipeLoading());
        this.recipeFormErrors.next(err);
      }
    );
  }

  // addIngredientsToShoppingList(ingredients: Ingredient[]) {
  //   this.shoppingListService.addIngredients(ingredients);
  // }
}
