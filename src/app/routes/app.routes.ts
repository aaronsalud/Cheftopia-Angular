import { Routes } from '@angular/router';
import { RecipesComponent } from '../components/recipes/recipes.component';
import { ShoppingListComponent} from '../components/shopping-list/shopping-list.component';

export const appRoutes: Routes = [
    { path: 'recipes', pathMatch: 'full', component: RecipesComponent },
    { path: 'shopping-list', pathMatch: 'full', component: ShoppingListComponent },
    { path: '',
      redirectTo: '/recipes',
      pathMatch: 'full'
    },
    // { path: '**', component: PageNotFoundComponent }
];