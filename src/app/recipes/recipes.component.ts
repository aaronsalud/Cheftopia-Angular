import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
Recipe;
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  recipes: Recipe[];
  selectedRecipe: Recipe;
  constructor() {}

  setRecipes(allRecipes) {
    this.recipes = allRecipes;

    if (!this.selectedRecipe) {
      this.selectedRecipe = this.recipes[0];
    }
  }

  ngOnInit() {}
}
