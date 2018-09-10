import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetRecipes } from '../../store/actions/recipe.actions';

@Injectable()
export class RecipeService {
  recipesUpdated = new Subject<Recipe[]>();
  activeRecipe: Subject<Recipe> = new Subject();
  recipeFormErrors = new Subject();
  recipeLoading = new Subject();
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
    return this.recipes && this.recipes.length > 0
      ? this.recipes.filter((recipe: Recipe) => recipe.id === id)[0]
      : null;
  }

  // Fetch Recipes Method
  getRecipes() {
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
      err => console.log(err)
    );
  }

  // Create Recipe Method
  addRecipe(recipe: Recipe) {
    this.http.post('/api/recipe', recipe).subscribe(
      (recipe: any) => {
        if (recipe) {
          const ingredients = this.generateIngredients(recipe.ingredients);
          this.recipes.push(this.generateRecipe(recipe));
          this.recipesUpdated.next(this.recipes.slice());
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      },
      err => this.recipeFormErrors.next(err)
    );
  }

  // Update Recipe Method
  editRecipe(id: number, recipe: Recipe) {
    this.http.put(`/api/recipe/${id}`, recipe).subscribe(
      (recipe: any) => {
        if (recipe) {
          const index = this.recipes.findIndex(
            recipeItem => recipeItem.id === recipe.id
          );
          this.recipes[index] = this.generateRecipe(recipe);
          this.recipesUpdated.next(this.recipes.slice());
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      },
      err => this.recipeFormErrors.next(err)
    );
  }

  // Delete Recipe Method
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

  // addIngredientsToShoppingList(ingredients: Ingredient[]) {
  //   this.shoppingListService.addIngredients(ingredients);
  // }
}
