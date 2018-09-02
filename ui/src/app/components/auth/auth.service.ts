import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './user.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable()
export class AuthService {
  loggedInSuccessfully = new Subject();
  loginErrors = new Subject();
  signUpErrors = new Subject();

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  login(data) {
    return this.http.post('/api/users/login', data);
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
