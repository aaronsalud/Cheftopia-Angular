import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('form')
  shoppingListForm: NgForm;
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  login(form: NgForm) {
    const { value } = form;
    this.authService.login(value);
  }
}
