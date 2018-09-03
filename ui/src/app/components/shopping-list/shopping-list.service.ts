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

  constructor(private router: Router, private http: HttpClient) {}

  private generateIngredient(ingredient) {
    return new Ingredient(ingredient.id, ingredient.name, ingredient.amount);
  }

  generateIngredients(shoppinglistIngredients) {
    const ingredients = [];
    if (shoppinglistIngredients && shoppinglistIngredients.length > 0) {
      shoppinglistIngredients.forEach(ingredient =>
        ingredients.push(this.generateIngredient(ingredient))
      );
    }
    return ingredients;
  }

  generateShoppingList(shoppinglist) {
    let ingredients = [];
    if (shoppinglist.ingredients && shoppinglist.ingredients.length > 0) {
      ingredients = this.generateIngredients(shoppinglist.ingredients);
    }

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
    return this.http.get(this.composeQueryString(queryParams));
  }

  getShoppingListById(id: number) {
    return this.http.get(`/api/shoppinglist/${id}`);
  }

  createShoppingList(postData) {
    return this.http.post(`/api/shoppinglist`, postData);
  }

  editShoppingList(id, postData) {
    return this.http.put(`/api/shoppinglist/${id}`, postData);
  }

  deleteShoppingList(id) {
    this.http.delete(`/api/shoppinglist/${id}`).subscribe(
      () => {
        const index = this.shopping_lists.findIndex(
          shoppinglist => shoppinglist.id === id
        );
        this.shopping_lists.splice(index, 1);
        this.shoppinglistsUpdated.next(this.shopping_lists.slice());
      },
      err => console.log(err)
    );
  }

  createIngredient(shoppinglistId, postData) {
    return this.http.post(
      `/api/shoppinglist/${shoppinglistId}/ingredient`,
      postData
    );
  }

  editIngredient(shoppinglistId, ingredientId, postData) {
    return this.http.put(
      `/api/shoppinglist/${shoppinglistId}/ingredient/${ingredientId}`,
      postData
    );
  }

  deleteIngredient(shoppinglistId, ingredientId) {
    return this.http.delete(
      `/api/shoppinglist/${shoppinglistId}/ingredient/${ingredientId}`
    );
  }
}
