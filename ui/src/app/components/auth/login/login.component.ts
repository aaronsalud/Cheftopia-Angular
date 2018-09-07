import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  errors;
  storeSubscription: Subscription;

  @ViewChild('form')
  loginForm: NgForm;
  constructor(private authService: AuthService, private store: Store) {
    this.storeSubscription = this.store
      .select(state => state.errors)
      .subscribe(errors => (this.errors = errors));
  }

  login(form: NgForm) {
    const { value } = form;
    this.authService.login(value);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }
}
