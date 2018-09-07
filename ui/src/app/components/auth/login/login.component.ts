import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Store } from '@ngxs/store';
import { LoginUser } from '../../../store/actions/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errors;

  @ViewChild('form')
  loginForm: NgForm;
  constructor(private authService: AuthService, private store: Store) {
    this.store
      .select(state => state.errors)
      .subscribe(errors => (this.errors = errors));
  }

  ngOnInit() {}

  login(form: NgForm) {
    const { value } = form;
    this.authService.login(value);
  }
}
