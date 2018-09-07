import { AuthService } from '../../components/auth/auth.service';
import { Store } from '@ngxs/store';
import { User } from '../../components/auth/user.model';

// Login User Action
export class LoginUser {
  static readonly type = '[AUTH] Login User';

  constructor(currentUser: User, private store: Store) {
    this.store.dispatch(new SetCurrentUser(true, currentUser));
  }
}

// Set Current User Action
export class SetCurrentUser {
  static readonly type = '[AUTH] Set Current User';
  payload: any;
  constructor(isAuthenticated: boolean, user: User) {
    this.payload = {
      isAuthenticated,
      user
    };
  }
}

// Set Current User Action
export class LogoutUser {
  static readonly type = '[AUTH] Logout User';
  constructor(private authService: AuthService) {
    this.authService.logout();
  }
}
