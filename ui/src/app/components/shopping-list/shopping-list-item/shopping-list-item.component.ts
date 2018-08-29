import { Component, OnInit, Input } from '@angular/core';
import { ShoppingList } from '../shopping-list.model';
import { ShoppingListService } from '../shopping-list.service';

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
  constructor(private shoppingListService: ShoppingListService) {}

  deleteItem(id) {
    this.shoppingListService.deleteShoppingList(id);
  }

  ngOnInit() {}
}
