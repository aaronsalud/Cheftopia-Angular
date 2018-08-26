import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}
  login(data) {
    return this.http.post('/api/users/login', data).subscribe(data => {
      console.log(data);
    });
  }
}
