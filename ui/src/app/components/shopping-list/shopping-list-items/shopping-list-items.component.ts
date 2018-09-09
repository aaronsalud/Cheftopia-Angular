import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { ShoppingList } from '../shopping-list.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list-items',
  templateUrl: './shopping-list-items.component.html',
  styleUrls: ['./shopping-list-items.component.css']
})
export class ShoppingListItemsComponent implements OnInit, OnDestroy {
  shoppingListsSubscription: Subscription;
  selectedArchiveOption = '';
  loading: boolean = false;
  shoppinglists: ShoppingList[];

  archiveSelectOptions = [
    { name: 'Filter by', value: '' },
    { name: 'Active', value: 0 },
    { name: 'Archived', value: 1 }
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  onArchiveFilterChange(event) {
    const queryParams = { archived: event };
    this.shoppingListService.getShoppingLists(queryParams);
  }

  ngOnInit() {
    this.shoppingListsSubscription = this.shoppingListService.shoppingListsUpdated.subscribe(
      shoppinglists => {
        this.shoppinglists = shoppinglists;
      }
    );
    this.shoppingListService.getShoppingLists();
  }

  ngOnDestroy() {
    this.shoppingListsSubscription.unsubscribe();
  }
}
