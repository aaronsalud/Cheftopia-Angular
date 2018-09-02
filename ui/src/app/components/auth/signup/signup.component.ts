import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { RegisterUser } from '../../../store/actions/auth.actions';
import { Router } from '@angular/router';
import { ClearErrors } from '../../../store/actions/errors.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  errors;

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router
  ) {
    this.store
      .select(state => state.errors.errors)
      .subscribe(errors => (this.errors = errors));
  }

  onSubmit() {
    this.store.dispatch(
      new RegisterUser(
        this.signUpForm.value,
        this.authService,
        this.store,
        this.router
      )
    );
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
    // Reset errors in the state
    this.store.dispatch(new ClearErrors());
  }

  ngOnInit() {
    this.initForm();
  }
}
