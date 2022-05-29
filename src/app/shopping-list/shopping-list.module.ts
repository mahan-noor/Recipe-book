import { LoggingService } from './../logging.service';
import { RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ShoppingListEditComponent } from "./shopping-list-edit/shopping-list-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent, 
  ],
  imports: [
    FormsModule, 
    RouterModule.forChild ([  
            {path: '' ,component: ShoppingListComponent},
   ]),
   SharedModule,

  ],
  // providers: [
  //   LoggingService
  // ]
})

export class ShoppingListModule {}