import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User;
  isLoggedIn: boolean;

  constructor(private authService: AuthService, private store: Store) {
    this.store
      .select(state => state.auth)
      .subscribe(({ isAuthenticated, user }) => {
        this.isLoggedIn = isAuthenticated;
        this.currentUser = user;
      });
  }
  // Collapse all menu dropdowns
  isMobileNavCollapsed = true;

  logout() {
    this.isLoggedIn = false;
    this.authService.logout();
    this.isMobileNavCollapsed = false;
  }

  ngOnInit() {}
}
