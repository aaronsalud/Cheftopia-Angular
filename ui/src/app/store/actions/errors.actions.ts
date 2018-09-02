// Get Errors Action
export class GetErrors {
  static readonly type = '[ERRORS] Get';

  constructor(public payload: any) {}
}

// Clear Errors Action
export class ClearErrors {
  static readonly type = '[ERRORS] Clear';

  constructor() {}
}
