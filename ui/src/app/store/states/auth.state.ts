import { State, Action } from '@ngxs/store';
import { SetCurrentUser, LogoutUser } from '../actions/auth.actions';

@State({
  name: 'auth',
  defaults: {
    isAuthenticated: false,
    user: null
  }
})
export class AuthState {
  @Action(SetCurrentUser)
  setCurrentUser({ setState }: any, { payload }: SetCurrentUser) {
    setState({
      ...payload
    });
  }

  @Action(LogoutUser)
  logoutUser({ patchState }: any) {
    patchState({
      isAuthenticated: false,
      user: null
    });
  }
}
