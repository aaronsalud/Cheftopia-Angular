import {
  Component,
  EventEmitter,
  Output
} from '../../../node_modules/@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  // Collapse all menu dropdowns
  isMobileNavCollapsed = true;
  isManageNavCollapsed = true;

  @Output()
  featureSelected = new EventEmitter<string>();
  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }
}
