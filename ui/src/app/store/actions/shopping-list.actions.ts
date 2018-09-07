import { ShoppingListService } from '../../components/shopping-list/shopping-list.service';
import { Store } from '@ngxs/store';
import { SetErrors } from './errors.actions';
import { ShoppingList } from '../../components/shopping-list/shopping-list.model';

// Delete a Shopping List
export class DeleteShoppingList {
  static readonly type = '[SHOPPING LIST] Delete a Shopping list';
  constructor(
    id: number,
    private store: Store,
    private shoppinglistService: ShoppingListService
  ) {
    this.store.dispatch(new ShoppingListLoading());
    const subscription = this.store
      .select(state => state.shoppinglistDashboard)
      .subscribe(({ shoppinglists }) => {
        if (shoppinglists) {
          this.shoppinglistService.deleteShoppingList(id).subscribe(
            () => {
              const index = shoppinglists.findIndex(
                shoppinglist => shoppinglist.id === id
              );
              shoppinglists.splice(index, 1);
              subscription.unsubscribe();
              this.store.dispatch(new SetShoppingLists(shoppinglists));
            },
            err => {
              subscription.unsubscribe();
              this.store.dispatch(new ShoppingListLoading());
              this.store.dispatch(new SetErrors(err));
            }
          );
        }
      });
  }
}

// Set Shopping List State
export class SetShoppingList {
  static readonly type = '[SHOPPING LIST] Set Shopping List';
  constructor(public shoppinglist: ShoppingList) {}
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
