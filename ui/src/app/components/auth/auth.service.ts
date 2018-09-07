import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './user.model';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ClearErrors, SetErrors } from '../../store/actions/errors.actions';
import { LoginUser } from '../../store/actions/auth.actions';

@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private router: Router,
    private store: Store
  ) {}

  dispatchErrors(errors) {
    this.store.dispatch(new SetErrors(errors));
    setTimeout(() => this.store.dispatch(new ClearErrors()), 5000);
  }

  login(data) {
    this.http.post('/api/users/login', data).subscribe(
      data => {
        this.setAuthToken(data['token']);
        this.router.navigate(['/recipes']);
        this.store.dispatch(new LoginUser(this.getCurrentUser(), this.store));
      },
      err => this.dispatchErrors(err)
    );
  }

  signup(data) {
    return this.http.post('/api/users/register', data);
  }

  setAuthToken(token) {
    localStorage.setItem('jwtToken', token);
  }

  getCurrentUser() {
    const token = this.getAuthToken();
    if (token) {
      const { id, name, avatar, exp } = this.jwtHelper.decodeToken(token);
      const currentUser = new User(id, name, avatar, exp);
      return currentUser;
    }
    return null;
  }

  getAuthToken() {
    return localStorage.getItem('jwtToken');
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
  }
}
