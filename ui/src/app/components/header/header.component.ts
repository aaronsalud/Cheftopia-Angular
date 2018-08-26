import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedInSuccessfullySubscription: Subscription;
  currentUser: User;
  isLoggedIn: boolean;

  constructor(private authService: AuthService) {}
  // Collapse all menu dropdowns
  isMobileNavCollapsed = true;

  logout() {
    this.isLoggedIn = false;
    this.authService.logout();
    this.isMobileNavCollapsed = false;
  }

  private setLoggedInState() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.isLoggedIn = true;
    }
  }

  ngOnInit() {
    // Subscribe to login events and set log in state
    this.loggedInSuccessfullySubscription = this.authService.loggedInSuccessfully.subscribe(
      () => {
        this.setLoggedInState();
      }
    );
    // Check for logged in state
    this.setLoggedInState();
  }

  ngOnDestroy() {
    this.loggedInSuccessfullySubscription.unsubscribe();
  }
}
