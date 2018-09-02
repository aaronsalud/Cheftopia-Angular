import { State, Action } from '@ngxs/store';
import { SetCurrentUser } from '../actions/auth.actions';

@State({
  name: 'auth',
  defaults: {
    isAuthenticated: false,
    user: {}
  }
})
export class AuthState {
  @Action(SetCurrentUser)
  setCurrentUser({ setState }: any, { payload }: SetCurrentUser) {
    setState({
      ...payload
    });
  }
}
