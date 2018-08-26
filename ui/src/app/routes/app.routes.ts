import { Routes } from '@angular/router';
import { RecipesComponent } from '../components/recipes/recipes.component';
import { ShoppingListComponent } from '../components/shopping-list/shopping-list.component';
import { RecipeDetailComponent } from '../components/recipes/recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from '../components/recipes/recipe-form/recipe-form.component';
import { LandingComponent } from '../components/landing/landing.component';
import { LoginComponent } from '../components/auth/login/login.component';
import { SignupComponent } from '../components/auth/signup/signup.component';
import { AccessGuard } from '../components/auth/guards/access.guard';
export const appRoutes: Routes = [
  {
    path: 'recipes',
    component: RecipesComponent,
    children: [
      { path: '', component: RecipeDetailComponent },
      { path: 'new', component: RecipeFormComponent },
      { path: ':id', component: RecipeDetailComponent },
      { path: ':id/edit', component: RecipeFormComponent }
    ],
    canActivate: [AccessGuard]
  },
  {
    path: 'shopping-list',
    pathMatch: 'full',
    component: ShoppingListComponent,
    canActivate: [AccessGuard]
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
    canActivate: [AccessGuard],
    data: { isPublicOnly: true }
  },
  {
    path: 'register',
    pathMatch: 'full',
    component: SignupComponent,
    canActivate: [AccessGuard],
    data: { isPublicOnly: true }
  },
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent,
    canActivate: [AccessGuard],
    data: { isPublicOnly: true }
  }
  // {
  //   path: '',
  //   redirectTo: '/recipes',
  //   pathMatch: 'full'
  // }
  // { path: '**', component: PageNotFoundComponent }
];
