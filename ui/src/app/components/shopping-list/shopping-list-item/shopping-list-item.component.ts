import { Component, OnInit, Input } from '@angular/core';
import { ShoppingList } from '../shopping-list.model';

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.css']
})
export class ShoppingListItemComponent implements OnInit {
  @Input()
  shoppinglist: ShoppingList;
  constructor() {}

  ngOnInit() {}
}
