import { State, Action } from '@ngxs/store';
import { SetCurrentUser, LogoutUser, LoginUser } from '../actions/auth.actions';

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

  @Action(LoginUser)
  loginUser({ patchState }: any, { currentUser } : LoginUser) {
    patchState({
      isAuthenticated: true,
      user: currentUser
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
