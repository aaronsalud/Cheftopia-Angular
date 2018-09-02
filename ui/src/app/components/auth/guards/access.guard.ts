import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../auth.service';
import { Store } from '@ngxs/store';
import { ClearErrors } from '../../../store/actions/errors.actions';

@Injectable({ providedIn: 'root' })
export class AccessGuard implements CanActivate {
  private errors: any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store
  ) {
    this.store
      .select(state => state.errors)
      .subscribe(errors => (this.errors = errors));
  }

  private clearErrors() {
    if (Object.keys(this.errors).length > 0) {
      this.store.dispatch(new ClearErrors());
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.getAuthToken()) {
      // Clear any pre existing form errors when switching routes
      this.clearErrors();

      // If logged in and hitting a public route, redirect to recipes
      if (route && route.data && route.data.isPublicOnly) {
        this.router.navigate(['/recipes']);
      }
      // logged in so return true
      return true;
    } else if (route.data.isPublicOnly) {
      // Clear any pre existing form errors
      this.clearErrors();
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
