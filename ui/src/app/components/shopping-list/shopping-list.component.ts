import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  shoppingListLoadingSuscription: Subscription;
  loading: boolean = false;
  constructor(private shoppinglistService: ShoppingListService) {}
  ngOnInit() {
    this.shoppingListLoadingSuscription = this.shoppinglistService.shoppingListLoading.subscribe(
      loading => {
        this.loading = loading;
      }
    );
  }

  ngOnDestroy() {
    this.shoppingListLoadingSuscription.unsubscribe();
  }
}
