import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  recipesUpdatedSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.recipesUpdatedSubscription = this.recipeService.recipesUpdated.subscribe(
      () => {
        this.initForm();
      }
    );
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      // Toggle edit mode if the id is set
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  ngOnDestroy() {
    this.recipesUpdatedSubscription.unsubscribe();
  }

  onSubmit() {
    // if (this.editMode) {
    //   this.recipeService.editRecipe(this.id, this.recipeForm.value);
    // } else {
    //   this.recipeService.addRecipe(this.recipeForm.value);
    // }
    //Exit form
    // this.onCancel();
    console.log(this.recipeForm.value);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  addIngredientInputGroup() {
    // Cast to FormArray
    (<FormArray>this.recipeForm.get('ingredients')).push(
      this.generateIngredientFormGroup(null)
    );
  }

  deleteIngredientInput(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private generateIngredientFormGroup(ingredient) {
    const id = ingredient && ingredient.id ? ingredient.id : null;
    const name = ingredient && ingredient.name ? ingredient.name : null;
    const amount = ingredient && ingredient.amount ? ingredient.amount : null;

    return new FormGroup({
      id: new FormControl(id),
      name: new FormControl(name, Validators.required),
      amount: new FormControl(amount, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
    });
  }

  private initForm() {
    let recipeName = '';
    let recipeImage = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipeById(this.id);
      if (recipe && recipe.ingredients) {
        recipeName = recipe.name;
        recipeImage = recipe.imagePath;
        recipeDescription = recipe.description;
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(this.generateIngredientFormGroup(ingredient));
        }
      }
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      image: new FormControl(recipeImage, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }
}
