import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Ingredient } from '../../shared/ingredient.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipesUpdatedSubscription: Subscription;
  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // addIngredientsToShoppingList(ingredients: Ingredient[]) {
  //   this.recipeService.addIngredientsToShoppingList(ingredients);
  // }

  editRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  deleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
  }

  ngOnInit() {
    this.recipesUpdatedSubscription = this.recipeService.recipesUpdated.subscribe(
      () => (this.recipe = this.recipeService.getRecipeById(this.id))
    );

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipeById(this.id);
    });
  }

  ngOnDestroy() {
    this.recipesUpdatedSubscription.unsubscribe();
  }
}
