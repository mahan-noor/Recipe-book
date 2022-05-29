import { SharedModule } from '../shared/shared.module';
import { RecipeRoutingModule } from './recipes.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeComponent } from './recipe.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';


@NgModule({
    declarations: [
        RecipeComponent,
        RecipeListComponent,
        RecipeItemComponent,
        RecipeDetailComponent,
        RecipeListComponent,
        RecipeEditComponent,
        RecipeStartComponent
        ],
    imports: [
        RouterModule,
        SharedModule,
        ReactiveFormsModule,
        RecipeRoutingModule,
    ],

})
export class RecipeModule {}