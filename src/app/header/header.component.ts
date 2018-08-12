import { Component } from '../../../node_modules/@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  // Collapse all menu dropdowns
  isMobileNavCollapsed = true;
  isManageNavCollapsed = true;
}
