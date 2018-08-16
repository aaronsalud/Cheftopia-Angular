import { Component, OnInit, OnDestroy } from '@angular/core';
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
  private ingredientEditSubscription: Subscription;
  editedItemIndex: number;
  editMode = false;

  constructor(private shoppingListService: ShoppingListService) {}

  saveItem(form: NgForm) {
    const { value } = form;
    if (value && value.name && value.amount) {
      const newIngredient = new Ingredient(value.name, value.amount);
      this.shoppingListService.addIngredient(newIngredient);
    }
  }

  ngOnInit() {
    this.ingredientEditSubscription = this.shoppingListService.ingredientEdit.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
      }
    );
  }

  ngOnDestroy() {
    this.ingredientEditSubscription.unsubscribe();
  }
}
