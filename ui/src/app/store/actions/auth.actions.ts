import { AuthService } from '../../components/auth/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetErrors, ClearErrors } from './errors.actions';
import { User } from '../../components/auth/user.model';

// Register User Action
export class RegisterUser {
  static readonly type = '[AUTH] Register User';

  constructor(
    payload: any,
    private authService: AuthService,
    private store: Store,
    private router: Router
  ) {
    this.store.dispatch(new ClearErrors());
    this.authService.signup(payload).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      err => this.store.dispatch(new SetErrors(err))
    );
  }
}

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
