import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListAction from "./shopping-list.actions";




export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}



const initialState: State = {
    ingredients: [
        new Ingredient('Apple', 50),
        new Ingredient('Mango', 40)
       ],
    editedIngredient: null,
    editedIngredientIndex: -1,
};



export function  shoppingListReducer(
    state: State = initialState, 
    action: ShoppingListAction.ShoppingListActions) {
    switch(action.type) {
        case ShoppingListAction.ADD_INGREDIENT:
            return {
                ...state,
                ingredients:[...state.ingredients, action.payload]
            };

        case ShoppingListAction.ADD_INGREDIENTs:
            return {
                ...state,
                ingredients:[...state.ingredients, ...action.payload]
            }

        case ShoppingListAction.UPDATE_INGREDIENTS:
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const upadatedIngredient = {
                ...ingredient,
                ...action.payload
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = upadatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null,

            };
        case ShoppingListAction.DELETE_INGREDIENTS:
            return {
                ...state,
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    return  igIndex != state.editedIngredientIndex;
                }),
                editedIngredientIndex: -1,
                editedIngredient: null,
            };

        case ShoppingListAction.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: { ...state.ingredients[action.payload]}
            }
        case ShoppingListAction.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1,

            }
        default:
            return state;
    }
}