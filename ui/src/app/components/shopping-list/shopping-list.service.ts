import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShoppingList } from './shopping-list.model';

@Injectable()
export class ShoppingListService {
  constructor(private http: HttpClient) {}

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
    return this.http.delete(`/api/shoppinglist/${id}`);
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
