import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const authToken = this.authService.getAuthToken();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && authToken) {
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
