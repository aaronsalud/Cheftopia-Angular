import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { ShoppingList } from './shopping-list.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  shoppinglists: ShoppingList[];
  ingredients: Ingredient[];
  private shoppinglistsUpdatedSubscription: Subscription;
  private ingredientsChangedSubscription: Subscription;
  constructor(private shoppingListService: ShoppingListService) { }

  editItem(index: number) {
    this.shoppingListService.ingredientEdit.next(index);
  }

  setupSubscriptions() {
    this.shoppinglistsUpdatedSubscription = this.shoppingListService.shoppinglistsUpdated.subscribe(
      (shoppinglists: ShoppingList[]) => {
        this.shoppinglists = shoppinglists;
        console.log(this.shoppinglists);
      }
    );
    this.ingredientsChangedSubscription = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => (this.ingredients = ingredients)
    );
  }

  ngOnInit() {
    this.setupSubscriptions();
    this.shoppingListService.getShoppingLists();
    // this.ingredients = this.shoppingListService.getIngredients();
  }

  ngOnDestroy() {
    this.ingredientsChangedSubscription.unsubscribe();
    this.shoppinglistsUpdatedSubscription.unsubscribe();
  }
}
