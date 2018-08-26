import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  logInErrorsSubscription: Subscription;
  errors;

  @ViewChild('form')
  shoppingListForm: NgForm;
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  login(form: NgForm) {
    this.logInErrorsSubscription = this.authService.loginErrors.subscribe(
      errors => {
        this.errors = errors;
      }
    );

    const { value } = form;
    this.authService.login(value);
  }

  ngOnDestroy() {
    this.logInErrorsSubscription.unsubscribe();
  }
}
