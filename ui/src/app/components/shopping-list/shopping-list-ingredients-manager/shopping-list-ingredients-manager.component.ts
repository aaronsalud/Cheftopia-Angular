import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopping-list-ingredients-manager',
  templateUrl: './shopping-list-ingredients-manager.component.html',
  styleUrls: ['./shopping-list-ingredients-manager.component.css']
})
export class ShoppingListIngredientsManagerComponent
  implements OnInit, OnDestroy {
  @ViewChild('form')
  ingredientForm: NgForm;
  ingredientBeingEdited: Ingredient;
  ingredients: Ingredient[] = [];
  shoppingListId: number;
  shoppingListName: string;
  shoppingListDescription: string;

  editMode = false;

  constructor(
    private shoppingListService: ShoppingListService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  saveItem(form: NgForm) {
    const { value } = form;

    if (this.editMode) {
      this.shoppingListService
        .editIngredient(
          this.shoppingListId,
          this.ingredientBeingEdited.id,
          value
        )
        .subscribe(
          (data: any) => {
            const { ingredients } = data;
            if (ingredients) {
              this.ingredients = ingredients;
            }
          },
          err => console.log(err)
        );
    } else if (value && value.name && value.amount) {
      this.shoppingListService
        .createIngredient(this.shoppingListId, value)
        .subscribe(
          (data: any) => {
            const { ingredients } = data;
            if (ingredients) {
              this.ingredients = ingredients;
            }
          },
          err => console.log(err)
        );
    }
    this.resetForm();
  }

  // deleteItem() {
  //   if (this.editedItemIndex >= 0) {
  //     this.shoppingListService.deleteIngredientByIndex(this.editedItemIndex);
  //     this.resetForm();
  //   }
  // }

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
    const shoppingListId: number = +this.route.snapshot.paramMap.get('id');
    if (shoppingListId) {
      this.shoppingListService.getShoppingListById(shoppingListId).subscribe(
        (shoppinglist: any) => {
          if (shoppinglist) {
            // Extract shopping list name and description
            this.shoppingListId = shoppinglist.id;
            this.shoppingListName = shoppinglist.name;
            this.shoppingListDescription = shoppinglist.description;
            const { ingredients } = shoppinglist;
            // Extract ingredients data
            if (ingredients && ingredients.length > 0) {
              shoppinglist.ingredients.forEach(ingredient => {
                const { id, name, amount } = ingredient;
                if (id && name && amount) {
                  this.ingredients.push(new Ingredient(id, name, amount));
                }
              });
            }
          }
        },
        err => console.log(err)
      );
    }
  }

  ngOnDestroy() {
    // this.ingredientEditSubscription.unsubscribe();
  }
}
