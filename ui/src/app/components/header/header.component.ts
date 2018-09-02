import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Store } from '@ngxs/store';
import { LogoutUser } from '../../store/actions/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User;
  isLoggedIn: boolean;

  // Collapse all menu dropdowns
  isMobileNavCollapsed = true;

  constructor(private authService: AuthService, private store: Store) {
    this.store
      .select(state => state.auth)
      .subscribe(({ isAuthenticated, user }) => {
        this.isLoggedIn = isAuthenticated;
        this.currentUser = user;
      });
  }

  logout() {
    this.store.dispatch(new LogoutUser(this.authService));
    this.isMobileNavCollapsed = false;
  }

  ngOnInit() {}
}
