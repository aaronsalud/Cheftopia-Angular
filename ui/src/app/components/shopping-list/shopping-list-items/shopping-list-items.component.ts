import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ShoppingListService } from '../shopping-list.service';
import { ShoppingList } from '../shopping-list.model';
import { GetShoppingLists } from '../../../store/actions/shopping-list.actions';

@Component({
  selector: 'app-shopping-list-items',
  templateUrl: './shopping-list-items.component.html',
  styleUrls: ['./shopping-list-items.component.css']
})
export class ShoppingListItemsComponent implements OnInit {
  selectedArchiveOption = '';
  loading: boolean = false;
  shoppinglists: ShoppingList[];
  archiveSelectOptions = [
    { name: 'Filter by', value: '' },
    { name: 'Active', value: 0 },
    { name: 'Archived', value: 1 }
  ];
  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store
  ) {
    this.store
      .select(state => state.shoppinglistDashboard)
      .subscribe(({ shoppinglists, loading }) => {
        this.shoppinglists = shoppinglists;
        this.loading = loading;
      });
  }

  onArchiveFilterChange(event) {
    const queryParams = { archived: event };
    this.store.dispatch(
      new GetShoppingLists(this.shoppingListService, this.store, queryParams)
    );
  }

  ngOnInit() {
    this.store.dispatch(
      new GetShoppingLists(this.shoppingListService, this.store)
    );
  }
}
