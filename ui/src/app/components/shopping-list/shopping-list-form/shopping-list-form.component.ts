import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShoppingList } from '../shopping-list.model';
import { Ingredient } from '../../shared/ingredient.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ShoppingListService } from '../shopping-list.service';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list-form',
  templateUrl: './shopping-list-form.component.html',
  styleUrls: ['./shopping-list-form.component.css']
})
export class ShoppingListFormComponent implements OnInit, OnDestroy {
  @ViewChild('form')
  shoppingListForm: NgForm;
  activeShoppingList: ShoppingList;
  shoppingListPreview: ShoppingList;
  storeSubscription: Subscription;
  editMode: boolean = false;
  id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private shoppingListService: ShoppingListService,
    private store: Store
  ) {
    this.storeSubscription = this.store
      .select(state => state.shoppinglistDashboard)
      .subscribe(({ shoppinglist }) => {
        this.activeShoppingList = shoppinglist;
        const formReady =
          this.shoppingListForm &&
          Object.keys(this.shoppingListForm.controls).length > 0;

        if (this.activeShoppingList && formReady) {
          this.initForm();
        }
      });
  }

  saveItem(form: NgForm) {
    const { value } = form;
    const postData = { name: value.name, description: value.description };

    if (!this.editMode) {
      this.shoppingListService.createShoppingList(postData).subscribe(
        () => {
          this.router.navigate(['shopping-list']);
        },
        err => console.log(err)
      );
    } else {
      const id = +this.route.snapshot.paramMap.get('id');
      this.shoppingListService.editShoppingList(id, postData).subscribe(
        () => {
          this.router.navigate(['shopping-list']);
        },
        err => console.log(err)
      );
    }
  }

  generatePreview(form: NgForm) {
    const { name, description, ingredients } = form.value;
    const shoppingListIngredients: Ingredient[] = ingredients;
    this.shoppingListPreview = null;

    if (name.length > 0 || description.length > 0) {
      this.shoppingListPreview = new ShoppingList(
        0,
        name,
        description,
        false,
        shoppingListIngredients
      );
    }
  }

  initForm() {
    const { name, description, ingredients } = this.activeShoppingList;
    if (name && description && ingredients) {
      this.shoppingListForm.setValue({
        name,
        description,
        ingredients
      });
      this.editMode = true;
      this.generatePreview(this.shoppingListForm);
    }
  }

  ngOnInit() {
    // Check for Id in param and switch to edit mode
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      // Dispatch Shopping List Fetch by Id
      if (this.id) {
        this.shoppingListService.getShoppingListById(this.id);
      }
    });
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }
}
