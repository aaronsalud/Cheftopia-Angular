import { State, Action, StateContext } from '@ngxs/store';
import { ShoppingList } from '../../components/shopping-list/shopping-list.model';
import {
  GetShoppingLists,
  ShoppingListLoading,
  SetShoppingLists
} from '../actions/shopping-list.actions';

export class ShoppingListStateModel {
  loading: boolean;
  shoppinglists: ShoppingList[];
}

@State<ShoppingListStateModel>({
  name: 'shoppinglistDashboard',
  defaults: {
    loading: false,
    shoppinglists: []
  }
})
export class ShoppingListState {
  @Action(SetShoppingLists)
  setShoppingLists(
    { setState }: StateContext<ShoppingListStateModel>,
    { payload }: SetShoppingLists
  ) {
    setState({
      loading: false,
      shoppinglists: payload
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
