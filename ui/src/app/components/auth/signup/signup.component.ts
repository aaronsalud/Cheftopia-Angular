import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signUpForm: FormGroup;
  signUpErrorsSubscription: Subscription;
  errors;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.signup(this.signUpForm.value);
  }

  private initForm() {
    let name = '';
    let email = '';
    let password = '';
    let password2 = '';

    this.signUpForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      email: new FormControl(email, Validators.required),
      password: new FormControl(password, Validators.required),
      password2: new FormControl(password2, Validators.required)
    });
  }

  ngOnInit() {
    this.signUpErrorsSubscription = this.authService.signUpErrors.subscribe(
      errors => (this.errors = errors)
    );

    this.initForm();
  }

  ngOnDestroy() {
    this.signUpErrorsSubscription.unsubscribe();
  }
}
