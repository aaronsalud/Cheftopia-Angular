import { State, Action } from '@ngxs/store';
import { GetErrors, ClearErrors } from '../actions/errors.actions';
@State({
  name: 'errors',
  defaults: {
    errors: {}
  }
})
export class ErrorsState {
  @Action(GetErrors)
  getErrors({ patchState }: any, { payload }: GetErrors) {
    patchState({
      errors: payload
    });
  }

  @Action(ClearErrors)
  clearErrors({ patchState }: any) {
    patchState({
      errors: {}
    });
  }
}
