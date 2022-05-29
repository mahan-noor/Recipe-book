import { ShoppingListActions } from './../store/shopping-list.actions';
import { Subscription } from 'rxjs';
import { Ingredient } from './../../shared/ingredient.model';
import { Component, OnInit,OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as ShoppingListAction from '../store/shopping-list.actions'
import * as fromApp from '../../store/app.reducer'

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  subscription : Subscription;
  editMode = false;
  editedItem: Ingredient;

 
  constructor(
    private store:Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
  
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      } else {
        this.editMode = false;
      }
    })
  }
  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListAction.UpdateIngredients(newIngredient))
      // this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      // this.slService.addIngredient(newIngredient)
      this.store.dispatch(new ShoppingListAction.AddIngredient(newIngredient))
    }
    this.editMode = false;
    form.reset()
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListAction.StopEdit());
  }

  onDelete() {
   this.store.dispatch(new ShoppingListAction.DeleteIngredients());
   
    // this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();

  }


  ngOnDestroy(): void {
      this.store.dispatch(new ShoppingListAction.StopEdit());
      this.subscription.unsubscribe();
    }
}