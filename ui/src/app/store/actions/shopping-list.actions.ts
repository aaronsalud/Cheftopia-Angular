import { ShoppingList } from '../../components/shopping-list/shopping-list.model';

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