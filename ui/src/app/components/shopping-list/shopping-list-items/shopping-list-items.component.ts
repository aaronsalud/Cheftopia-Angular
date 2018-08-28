import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-list-items',
  templateUrl: './shopping-list-items.component.html',
  styleUrls: ['./shopping-list-items.component.css']
})
export class ShoppingListItemsComponent implements OnInit {
  selectedArchiveOption = '';
  archiveSelectOptions = [
    { name: 'Filter by', value: '' },
    { name: 'Active', value: false },
    { name: 'Archived', value: true }
  ];
  constructor() {}

  onArchiveFilterChange(event) {
    console.log(event);
  }

  ngOnInit() {}
}
