import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShoppingList } from '../shopping-list.model';
import { Ingredient } from '../../shared/ingredient.model';
import { ActivatedRoute } from '@angular/router';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-form',
  templateUrl: './shopping-list-form.component.html',
  styleUrls: ['./shopping-list-form.component.css']
})

export class ShoppingListFormComponent implements OnInit {
  editMode: boolean = false;
  shoppingListPreview: ShoppingList

  constructor(private route: ActivatedRoute, private shoppingListService: ShoppingListService) { }

  saveItem(form: NgForm) {
    const { value } = form;

    console.log(value);
  }

  generatePreview(form: NgForm) {
    const { name, description } = form.value;
    const ingredients: Ingredient[] = [];
    this.shoppingListPreview = null;

    if (name.length > 0 || description.length > 0) {
      this.shoppingListPreview = new ShoppingList(0, name, description, false, ingredients);
    }
  }

  ngOnInit() {
    const shoppingListId: number = +this.route.snapshot.paramMap.get('id');
    if (shoppingListId) {
      const shoppinglist = this.shoppingListService.getShoppingListById(shoppingListId);

    }
  }

}
