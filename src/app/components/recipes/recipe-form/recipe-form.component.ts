import { Component, OnInit } from "@angular/core";
import { RecipeService } from "../recipe.service";

@Component({
    selector: 'app-recipe-form',
    templateUrl: './recipe-form.component.html',
    styleUrls: ['./recipe-form.component.css'],
    providers: [RecipeService]
  })
  export class RecipeFormComponent implements OnInit {
    constructor() {}
  
    ngOnInit() {}
  }
  