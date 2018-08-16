import { Component, OnInit } from "@angular/core";
import { RecipeService } from "../recipe.service";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
    selector: 'app-recipe-form',
    templateUrl: './recipe-form.component.html',
    styleUrls: ['./recipe-form.component.css'],
    providers: [RecipeService]
  })
  export class RecipeFormComponent implements OnInit {
    id: number;
    editMode = false;
    constructor(private route: ActivatedRoute) {}
  
    ngOnInit() {
      this.route.params.subscribe((params: Params)=>{
        this.id = +params['id'];
        // Toggle edit mode if the id is set
        this.editMode = params['id'] != null;

      })
    }
  }
  