// Get Errors Action
export class GetErrors {
  static readonly type = '[ERRORS] Get Errors';

  constructor(public payload: any) {}
}

// Clear Errors Action
export class ClearErrors {
  static readonly type = '[ERRORS] Clear Errors';

  constructor() {}
}
