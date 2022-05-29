import { map, take, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import  * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipe/store/recipe.action';
import { Actions, ofType} from '@ngrx/effects'
import { of } from 'rxjs';




@Injectable({
    providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]>{

    constructor (private store: Store<fromApp.AppState>,
                private actions$: Actions) {
        
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select('recipes').pipe(
            take(1),
            map(recipesState => {
            return recipesState.recipes
        }),
        switchMap(recipes => {
          if (recipes.length === 0) {
            this.store.dispatch(new RecipesActions.FetchRecipes())
            return this.actions$.pipe(
                ofType(RecipesActions.SET_RECIPES), 
                take(1)
                );
          } else {
            return of(recipes)
          }
        }))


    }
}