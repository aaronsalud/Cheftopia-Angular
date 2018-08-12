import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe(
      'Chicken Inasal',
      'This is the recipe',
      'https://images.summitmedia-digital.com/yummyph/images/04-2013_recipes/04-2013_yummy-ph_recipe_image_sari-jorges-chicken-inasal_main.jpg'
    ),
    new Recipe(
      'Chicken Inasal',
      'This is the recipe',
      'https://images.summitmedia-digital.com/yummyph/images/04-2013_recipes/04-2013_yummy-ph_recipe_image_sari-jorges-chicken-inasal_main.jpg'
    )
  ];

  constructor() {}

  ngOnInit() {}
}
