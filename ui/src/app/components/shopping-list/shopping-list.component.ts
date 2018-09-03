import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  loading: boolean = false;
  constructor(private store: Store) {
    this.store
      .select(state => state.shoppinglistDashboard)
      .subscribe(({ loading }) => {
        this.loading = loading;
      });
  }
  ngOnInit() {}
}
