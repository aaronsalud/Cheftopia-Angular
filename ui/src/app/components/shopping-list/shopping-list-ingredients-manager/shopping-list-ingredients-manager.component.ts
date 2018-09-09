import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ShoppingList } from '../shopping-list.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list-ingredients-manager',
  templateUrl: './shopping-list-ingredients-manager.component.html',
  styleUrls: ['./shopping-list-ingredients-manager.component.css']
})
export class ShoppingListIngredientsManagerComponent
  implements OnInit, OnDestroy {
  @ViewChild('form')
  ingredientForm: NgForm;
  activeShoppingListSubscription: Subscription;
  ingredientBeingEdited: Ingredient;
  activeShoppingList: ShoppingList;
  editMode: boolean = false;
  id: number;

  constructor(
    private shoppingListService: ShoppingListService,
    private route: ActivatedRoute
  ) {}

  saveItem(form: NgForm) {
    const { value } = form;
    // Edit Ingredient
    if (this.editMode) {
      this.shoppingListService.editIngredient(
        this.id,
        this.ingredientBeingEdited.id,
        value
      );
    }
    // Create Ingredient
    else if (value && value.name && value.amount) {
      this.shoppingListService.createIngredient(this.id, value);
    }
  }

  deleteItem() {
    this.shoppingListService.deleteIngredient(
      this.id,
      this.ingredientBeingEdited.id
    );
  }

  resetForm() {
    this.editMode = false;
    this.ingredientBeingEdited = null;
    this.ingredientForm.reset();
  }

  toggleIngredientEdit(ingredient) {
    this.ingredientBeingEdited = ingredient;
    this.editMode = true;
    this.ingredientForm.setValue({
      name: ingredient.name,
      amount: ingredient.amount
    });
  }

  ngOnInit() {
    // Check for Id in param and switch to edit mode
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      if (this.id) {
        this.shoppingListService.getShoppingListById(this.id);
      }
    });

    this.activeShoppingListSubscription = this.shoppingListService.activeShoppingList.subscribe(
      shoppinglist => {
        this.activeShoppingList = shoppinglist;
        this.resetForm();
      }
    );
  }

  ngOnDestroy() {
    this.activeShoppingListSubscription.unsubscribe();
  }
}
