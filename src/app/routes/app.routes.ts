import { Routes } from '@angular/router';
import { RecipesComponent } from '../components/recipes/recipes.component';
import { ShoppingListComponent } from '../components/shopping-list/shopping-list.component';
import { RecipeDetailComponent } from '../components/recipes/recipe-detail/recipe-detail.component';

export const appRoutes: Routes = [
  {
    path: 'recipes', component: RecipesComponent, children: [
      { path: ':id', component: RecipeDetailComponent },
      { path: '', component: RecipeDetailComponent }
    ]
  },
  { path: 'shopping-list', pathMatch: 'full', component: ShoppingListComponent },
  {
    path: '',
    redirectTo: '/recipes',
    pathMatch: 'full'
  },
  // { path: '**', component: PageNotFoundComponent }
];