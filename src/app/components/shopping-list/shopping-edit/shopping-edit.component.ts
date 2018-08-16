import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form')
  shoppingListForm: NgForm;
  private ingredientEditSubscription: Subscription;
  editedItemIndex: number;
  editedItem: Ingredient;
  editMode = false;

  constructor(private shoppingListService: ShoppingListService) {}

  saveItem(form: NgForm) {
    const { value } = form;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.shoppingListService.editIngredientByIndex(
        this.editedItemIndex,
        newIngredient
      );
    } else if (value && value.name && value.amount) {
      this.shoppingListService.addIngredient(newIngredient);
    }
  }

  ngOnInit() {
    this.ingredientEditSubscription = this.shoppingListService.ingredientEdit.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredientByIndex(index);
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  ngOnDestroy() {
    this.ingredientEditSubscription.unsubscribe();
  }
}
