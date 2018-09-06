import { Component, OnInit, Input } from '@angular/core';
import { ShoppingList } from '../shopping-list.model';
import { ShoppingListService } from '../shopping-list.service';
import { Store } from '@ngxs/store';
import { DeleteShoppingList } from '../../../store/actions/shopping-list.actions';

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.css']
})
export class ShoppingListItemComponent implements OnInit {
  @Input()
  shoppinglist: ShoppingList;
  @Input()
  hideActions: boolean;
  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store
  ) {}

  deleteItem(id) {
    this.store.dispatch(
      new DeleteShoppingList(id, this.store, this.shoppingListService)
    );
  }

  ngOnInit() {}
}
