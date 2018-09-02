import { AuthService } from '../../components/auth/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetErrors, ClearErrors } from './errors.actions';

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
      err => this.store.dispatch(new GetErrors(err))
    );
  }
}

// Login User Action
// export class LoginUser {
//   static readonly type = '[AUTH] Login User';

//   constructor(
//     payload: any,
//     private authService: AuthService,
//     private store: Store,
//     private router: Router
//   ) {
//     this.store.dispatch(new ClearErrors());
//     this.authService.signup(payload).subscribe(
//       () => {
//         this.router.navigate(['/login']);
//       },
//       err => this.store.dispatch(new GetErrors(err))
//     );
//   }
// }

// export class getShoppingLists {
//   static readonly type = '[SHOPPING LIST] Get';

//   constructor() {}
// }

// export class RemoveTutorial {
//     static readonly type = '[TUTORIAL] Remove'

//     constructor(public payload: string) {}
// }
