import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ShoppingList } from './shopping-list.model';

@Injectable()
export class ShoppingListService {
  shoppinglistsUpdated = new Subject<ShoppingList[]>();
  ingredientsChanged = new Subject<Ingredient[]>();
  ingredientEdit = new Subject<number>();
  shopping_lists: ShoppingList[];

  ingredients: Ingredient[] = [
    new Ingredient(1, 'Apples', 5),
    new Ingredient(2, 'Tomatoes', 10)
  ];

  constructor(private router: Router, private http: HttpClient) {}

  private generateIngredient(ingredient) {
    return new Ingredient(ingredient.id, ingredient.name, ingredient.amount);
  }

  private generateIngredients(shoppinglistIngredients) {
    const ingredients = [];
    if (shoppinglistIngredients && shoppinglistIngredients.length > 0) {
      shoppinglistIngredients.forEach(ingredient =>
        ingredients.push(this.generateIngredient(ingredient))
      );
    }
    return ingredients;
  }

  private generateShoppingList(shoppinglist, ingredients) {
    return new ShoppingList(
      shoppinglist.id,
      shoppinglist.name,
      shoppinglist.description,
      shoppinglist.archived,
      ingredients
    );
  }

  composeQueryString(queryParams) {
    if (!queryParams) {
      return '/api/shoppinglist';
    }

    let queryString = '/api/shoppinglist';
    let i = 0;

    Object.keys(queryParams).forEach(key => {
      queryString += `${i === 0 ? '?' : '&'}${key}=${queryParams[key]}`;
    });
    return queryString;
  }

  // Fetch Shopping Lists Method
  getShoppingLists(queryParams = null) {
    this.http.get(this.composeQueryString(queryParams)).subscribe(
      (shoppinglists: any) => {
        this.shopping_lists = [];
        shoppinglists.forEach((shoppinglist: any) => {
          if (shoppinglist) {
            const ingredients = this.generateIngredients(
              shoppinglist.ingredients
            );
            this.shopping_lists.push(
              this.generateShoppingList(shoppinglist, ingredients)
            );
          }
        });
        this.shoppinglistsUpdated.next(this.shopping_lists.slice());
      },
      err => console.log(err)
    );
  }

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
