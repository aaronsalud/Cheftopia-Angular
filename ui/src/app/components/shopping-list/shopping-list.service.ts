import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShoppingList } from './shopping-list.model';
import { Store } from '@ngxs/store';
import { ShoppingListLoading, SetShoppingLists, SetShoppingList } from '../../store/actions/shopping-list.actions';
import { SetErrors } from '../../store/actions/errors.actions';

@Injectable()
export class ShoppingListService {
  shoppinglists: ShoppingList[];
  constructor(private http: HttpClient, private store: Store) {
    this.store
      .select(state => state.shoppinglistDashboard)
      .subscribe(({ shoppinglists }) => {
        if (shoppinglists) {
          this.shoppinglists = shoppinglists;
        }
      });
  }

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
    this.store.dispatch(new ShoppingListLoading());
    this.http.get(this.composeQueryString(queryParams)).subscribe(
      (shoppinglists: any) => {
        const shopping_lists: ShoppingList[] = [];
        shoppinglists.forEach((shoppinglist: any) => {
          if (shoppinglist) {
            shopping_lists.push(
              this.generateShoppingList(shoppinglist)
            );
          }
        });
        this.store.dispatch(new SetShoppingLists(shopping_lists));
      },
      err => {
        this.store.dispatch(new ShoppingListLoading());
        this.store.dispatch(new SetErrors(err));
      }
    );
  }

  // Fetch Shopping List By Id
  getShoppingListById(id: number) {
    this.store.dispatch(new ShoppingListLoading());
    this.http.get(`/api/shoppinglist/${id}`).subscribe(
      (shoppinglist: any) => {
        let shopping_list: ShoppingList;
        if (shoppinglist) {
          shopping_list = this.generateShoppingList(shoppinglist)
        }
        this.store.dispatch(new SetShoppingList(shopping_list));
      },
      err => {
        this.store.dispatch(new ShoppingListLoading());
        this.store.dispatch(new SetErrors(err));
      }
    );
  }

  createShoppingList(postData) {
    return this.http.post(`/api/shoppinglist`, postData);
  }

  editShoppingList(id, postData) {
    return this.http.put(`/api/shoppinglist/${id}`, postData);
  }

  deleteShoppingList(id) {
    this.store.dispatch(new ShoppingListLoading());
    this.http.delete(`/api/shoppinglist/${id}`).subscribe(
      () => {
        const index = this.shoppinglists.findIndex(
          shoppinglist => shoppinglist.id === id
        );
        this.shoppinglists.splice(index, 1);
        this.store.dispatch(new SetShoppingLists(this.shoppinglists));
      },
      err => {
        this.store.dispatch(new ShoppingListLoading());
        this.store.dispatch(new SetErrors(err));
      }
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
