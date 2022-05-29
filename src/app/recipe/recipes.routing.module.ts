import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { AuthGuard } from '../auth/auth.guard';
import { RecipeComponent } from './recipe.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeResolverService } from './recipe-resolve.service';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';

 const routes: Routes = [
    {path: '' ,component: RecipeComponent , 
    canActivate: [AuthGuard],
    children: [
        {path: '', component: RecipeStartComponent},
        {path: 'new',component: RecipeEditComponent},
        {path: ':id',component: RecipeDetailComponent, resolve: [RecipeResolverService]},
        {path: ':id/edit',component: RecipeEditComponent,resolve: [RecipeResolverService]},
    ]}, 
 ]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipeRoutingModule {}