import { State, Action, StateContext } from '@ngxs/store';
import { ShoppingList } from '../../components/shopping-list/shopping-list.model';
import {
  ShoppingListLoading,
  SetShoppingLists,
  SetShoppingList
} from '../actions/shopping-list.actions';

export class ShoppingListStateModel {
  loading: boolean;
  shoppinglists: ShoppingList[];
  shoppinglist: ShoppingList;
}

@State<ShoppingListStateModel>({
  name: 'shoppinglistDashboard',
  defaults: {
    loading: false,
    shoppinglists: [],
    shoppinglist: null
  }
})
export class ShoppingListState {
  @Action(SetShoppingLists)
  setShoppingLists(
    { patchState }: StateContext<ShoppingListStateModel>,
    { payload }: SetShoppingLists
  ) {
    patchState({
      loading: false,
      shoppinglists: payload,
      shoppinglist: null
    });
  }

  @Action(SetShoppingList)
  setShoppingList(
    { patchState }: StateContext<ShoppingListStateModel>,
    { payload }: SetShoppingList
  ) {
    patchState({
      loading: false,
      shoppinglist: payload
    });
  }

  @Action(ShoppingListLoading)
  shoppinglistLoading({
    patchState,
    getState
  }: StateContext<ShoppingListStateModel>) {
    const state = getState();
    patchState({
      loading: !state.loading
    });
  }
}
