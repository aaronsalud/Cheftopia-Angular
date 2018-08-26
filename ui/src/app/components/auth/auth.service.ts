import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  currentUser: User;
  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  login(data) {
    return this.http.post('/api/users/login', data).subscribe(
      data => {
        this.setAuthToken(data['token']);
        this.setCurrentUser(data['token']);
      },
      err => console.log(err)
    );
  }

  private setAuthToken(token) {
    localStorage.setItem('jwtToken', token);
  }

  private setCurrentUser(token) {
    const { id, name, avatar, exp } = this.jwtHelper.decodeToken(token);
    this.currentUser = new User(id, name, avatar, exp);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getAuthToken() {
    return localStorage.getItem('jwtToken');
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
  }
}
