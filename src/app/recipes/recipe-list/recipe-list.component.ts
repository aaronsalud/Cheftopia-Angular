import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output()
  onSelectRecipe = new EventEmitter<Recipe>();
  @Output()
  allRecipes = new EventEmitter<Recipe[]>();
  recipes: Recipe[];

  onRecipeSelected(recipe: Recipe) {
    this.onSelectRecipe.emit(recipe);
  }

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    console.log(this.recipeService);
    this.recipes = this.recipeService.getRecipes();
    this.allRecipes.emit(this.recipes);
  }
}
