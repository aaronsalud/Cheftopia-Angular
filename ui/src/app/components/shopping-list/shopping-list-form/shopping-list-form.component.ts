import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShoppingList } from '../shopping-list.model';
import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list-form',
  templateUrl: './shopping-list-form.component.html',
  styleUrls: ['./shopping-list-form.component.css']
})

export class ShoppingListFormComponent implements OnInit {
  editMode: boolean = false;
  shoppingListPreview: ShoppingList

  constructor() { }

  saveItem(form: NgForm) {
    const { value } = form;

    console.log(value);
    // const newIngredient = new Ingredient(value.name, value.amount);
    // if (this.editMode) {
    //   this.shoppingListService.editIngredientByIndex(
    //     this.editedItemIndex,
    //     // newIngredient
    //   );
    // } else if (value && value.name && value.amount) {
    //   // this.shoppingListService.addIngredient(newIngredient);
    // }
    // this.resetForm();
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
  }

}
