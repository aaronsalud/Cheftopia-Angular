import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from './recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit, OnDestroy {
  recipeLoadingSuscription: Subscription;
  loading: boolean = true;
  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.recipeLoadingSuscription = this.recipeService.recipeLoading.subscribe(
      loading => {
        this.loading = loading;
      }
    );
  }

  ngOnDestroy() {
    this.recipeLoadingSuscription.unsubscribe();
  }
}
