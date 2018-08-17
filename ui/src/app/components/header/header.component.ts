import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  // Collapse all menu dropdowns
  isMobileNavCollapsed = true;
}
