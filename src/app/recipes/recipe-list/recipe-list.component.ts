import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe.model';

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
  recipes: Recipe[] = [
    new Recipe(
      'Chicken Inasal',
      'This is the recipe',
      'https://images.summitmedia-digital.com/yummyph/images/04-2013_recipes/04-2013_yummy-ph_recipe_image_sari-jorges-chicken-inasal_main.jpg'
    ),
    new Recipe(
      'Chicken Tikka',
      'This is the recipe',
      'https://images.summitmedia-digital.com/yummyph/images/04-2013_recipes/04-2013_yummy-ph_recipe_image_sari-jorges-chicken-inasal_main.jpg'
    )
  ];

  onRecipeSelected(recipe: Recipe) {
    this.onSelectRecipe.emit(recipe);
  }

  constructor() {}

  ngOnInit() {
    this.allRecipes.emit(this.recipes);
  }
}
