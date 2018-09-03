import { ShoppingListService } from '../../components/shopping-list/shopping-list.service';
import { Store } from '@ngxs/store';
import { SetErrors } from './errors.actions';
import { ShoppingList } from '../../components/shopping-list/shopping-list.model';

// Fetch Shopping List Data
export class GetShoppingLists {
  static readonly type = '[SHOPPING LIST] Fetch shopping lists';
  private shoppinglists: ShoppingList[] = [];

  constructor(
    private shoppinglistService: ShoppingListService,
    private store: Store,
    queryParam: any = null
  ) {
    this.store.dispatch(new ShoppingListLoading());
    this.shoppinglistService.getShoppingLists(queryParam).subscribe(
      (shoppinglists: any) => {
        shoppinglists.forEach((shoppinglist: any) => {
          if (shoppinglist) {
            this.shoppinglists.push(
              this.shoppinglistService.generateShoppingList(shoppinglist)
            );
          }
        });
        this.store.dispatch(new SetShoppingLists(shoppinglists));
      },
      err => {
        this.store.dispatch(new ShoppingListLoading());
        this.store.dispatch(new SetErrors(err));
      }
    );
  }
}

// Set Shopping Lists State
export class SetShoppingLists {
  static readonly type = '[SHOPPING LIST] Set Shopping Lists';
  constructor(public payload: ShoppingList[]) {}
}

// Set Loading State
export class ShoppingListLoading {
  static readonly type = '[SHOPPING LIST] Loading';
  constructor() {}
}
