import { State, Action } from '@ngxs/store';
import { SetErrors, ClearErrors } from '../actions/errors.actions';
@State({
  name: 'errors',
  defaults: {}
})
export class ErrorsState {
  @Action(SetErrors)
  getErrors({ setState }: any, { payload }: SetErrors) {
    setState({
      ...payload
    });
  }

  @Action(ClearErrors)
  clearErrors({ setState }: any) {
    setState({});
  }
}
