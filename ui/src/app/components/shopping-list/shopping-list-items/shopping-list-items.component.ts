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
    { name: 'Active', value: false },
    { name: 'Archived', value: true }
  ];
  constructor(private shoppingListService: ShoppingListService) {}

  onArchiveFilterChange(event) {
    console.log(event);
  }

  ngOnInit() {
    this.shoppinglistsUpdatedSubscription = this.shoppingListService.shoppinglistsUpdated.subscribe(
      (shoppinglists: ShoppingList[]) => {
        this.shoppinglists = shoppinglists;
      }
    );
  }
}
