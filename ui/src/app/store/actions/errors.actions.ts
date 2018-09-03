// Get Errors Action
export class SetErrors {
  static readonly type = '[ERRORS] Set Errors';

  constructor(public payload: any) {}
}

// Clear Errors Action
export class ClearErrors {
  static readonly type = '[ERRORS] Clear Errors';

  constructor() {}
}
