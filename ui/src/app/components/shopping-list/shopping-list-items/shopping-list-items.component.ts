import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { Subscription } from 'rxjs';
import { ShoppingList } from '../shopping-list.model';

@Component({
  selector: 'app-shopping-list-items',
  templateUrl: './shopping-list-items.component.html',
  styleUrls: ['./shopping-list-items.component.css']
})
export class ShoppingListItemsComponent implements OnInit {
  shoppinglistsUpdatedSubscription: Subscription;
  selectedArchiveOption = '';
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
    this.shoppinglistsUpdatedSubscription = this.shoppingListService.shoppinglistsUpdated.subscribe(
      (shoppinglists: ShoppingList[]) => {
        this.shoppinglists = shoppinglists;
      }
    );
  }
}
