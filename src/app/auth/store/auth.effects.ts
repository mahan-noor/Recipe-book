import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import * as AuthActions from './auth.actions';
import { User } from '../user.model';


export interface AuthResponseData {
    idToken:	string;	
    email:	string;	
    refreshToken : string;	
    expiresIn: string;
    localld: string;	
    registered?: boolean
    }

const handleAuthentication = (
    expiresIn: number, 
    email:string,
    userId:string, 
    token:string ) => {

    const expirationDate = new Date(
        new Date().getTime() + expiresIn * 1000)
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess ({
       email:  email,
       userId: userId,
       token:  token, 
       expirationDate: expirationDate,
       redirect: true,
    });
};

const handleError = (errorRes: any) => {
    let errorMessage = 'An unknown error Occurred';
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage))
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This Email Exist already';
        break;
        case 'EMAIL_NOT_FOUND':
            errorMessage ='This email does not exist';
        break;
        case 'INVALID_PASSWORD':
            errorMessage = 'The password id incorrect';
        break;
    }
        return of(new AuthActions.AuthenticateFail(errorMessage));  
};

@Injectable()   
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) =>{
            return this.http.post<AuthResponseData>
            ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
            {
            email: signupAction.payload.email,
            password: signupAction.payload.password, 
            returnSecureToken: true 
            }
         ).pipe(
            tap(resData => {
                this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map(resData => {
               return handleAuthentication(
                    +resData.expiresIn,
                    resData.email,
                    resData.localld,
                    resData.idToken
                );
            }),
           catchError( errorRes => {
               return handleError(errorRes)
           })
        );
        })
    )


    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>
            ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
            {
                email: authData.payload.email,
                password: authData.payload.password, 
                returnSecureToken: true    
            }    
            ).pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn  * 1000);
                }),
                map(resData => {
                   return handleAuthentication(+resData.expiresIn,resData.email,resData.localld,resData.idToken)
               }),
                catchError( errorRes => {
                    return handleError(errorRes)                
               })
            ); 
        }),

    );
        @Effect({ dispatch: false})
        authRedirect = this.actions$.pipe(
            ofType(AuthActions.AUTHENTICATE_SUCCESS), 
            tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
                if (authSuccessAction.payload.redirect){
                    this.router.navigate(['/'])
                }
      
        })
        );

        @Effect()
        autoLogin = this.actions$.pipe(
            ofType(AuthActions.AUTO_LOGIN),
            map(() => {
            const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                return { type: 'DUMMY' };
            }

            const loadedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate)
            );

            if (loadedUser.token) {
                // this.user.next(loadedUser);
                const expirationDuration =
                  new Date(userData._tokenExpirationDate).getTime() -
                  new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration)
                return new AuthActions.AuthenticateSuccess({
                email: loadedUser.email,
                userId: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate),
                redirect: false
                });

                // const expirationDuration =
                //   new Date(userData._tokenExpirationDate).getTime() -
                //   new Date().getTime();
                // this.autoLogout(expirationDuration);
            }
            return { type: 'DUMMY' };
            })
        );
        @Effect({ dispatch: false})
        authLogout = this.actions$.pipe(
            ofType(AuthActions.LOGOUT), 
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth'])
            })
        )

    constructor (
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService) {}
}

















