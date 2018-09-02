import { State, Action } from '@ngxs/store';
import { GetErrors, ClearErrors } from '../actions/errors.actions';
@State({
  name: 'errors',
  defaults: {}
})
export class ErrorsState {
  @Action(GetErrors)
  getErrors({ setState }: any, { payload }: GetErrors) {
    setState({
      ...payload
    });
  }

  @Action(ClearErrors)
  clearErrors({ patchState }: any) {
    patchState({
      errors: {}
    });
  }
}
