import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable()
export class ShoppingListService {
  constructor(private router: Router) { }
  ingredientsChanged = new Subject<Ingredient[]>();
  ingredientEdit = new Subject<number>();
  ingredients: Ingredient[] = [
    new Ingredient(1, 'Apples', 5),
    new Ingredient(2, 'Tomatoes', 10)
  ];

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.router.navigate(['/shopping-list']);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredientByIndex(index: number) {
    return this.ingredients[index];
  }

  editIngredientByIndex(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredientByIndex(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
