import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Store } from '@ngxs/store';
import { LogoutUser } from '../../store/actions/auth.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User;
  isLoggedIn: boolean;
  storeSubscription: Subscription;

  // Collapse all menu dropdowns
  isMobileNavCollapsed = true;

  constructor(private authService: AuthService, private store: Store) {
    this.storeSubscription = this.store
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
  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }
}
