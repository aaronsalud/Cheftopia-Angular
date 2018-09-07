import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Store } from '@ngxs/store';
import { SetCurrentUser } from '../../../store/actions/auth.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  auth: any;
  constructor(private authService: AuthService, private store: Store) {
    this.store
      .select(state => state.auth)
      .subscribe(auth => (this.auth = auth));
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const authToken = this.authService.getAuthToken();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && authToken) {
      if (this.auth && (!this.auth.isAuthenticated || !this.auth.user )) {
        this.store.dispatch(new SetCurrentUser(true, currentUser));
      }
      request = request.clone({
        headers: request.headers
          .set('Authorization', authToken)
          .set('Cache-Control', 'no-cache')
          .set('Pragma', 'no-cache')
      });
    }

    return next.handle(request);
  }
}
