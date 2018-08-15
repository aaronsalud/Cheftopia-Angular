import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../recipe.service';
Recipe;
@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input()
  recipe: Recipe;
  isActive = false;

  constructor(private recipeService: RecipeService) {}

  onSelected() {
    this.recipeService.setActiveRecipeItem(this.recipe);
  }

  ngOnInit() {
    this.recipeService.recipeSelected.subscribe(
      (recipe: Recipe) =>
        this.recipe == recipe ? (this.isActive = true) : (this.isActive = false)
    );
  }
}
