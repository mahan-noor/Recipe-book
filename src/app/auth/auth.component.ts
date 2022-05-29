import { PlaceHolderDirective } from './../shared/placeholder/palceholder.directive';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AlertComponent } from '../shared/alert/alert.component'
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy{
  isLoggingMode = true;
  isLoading : boolean = false;
  error : string = null;

  @ViewChild(PlaceHolderDirective , {static:false}) alertHost : PlaceHolderDirective;

  private _closeSubscription;
  private storeSub: Subscription;


  constructor( 
   
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
     this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error)
      }

    });
  }
  onSwitchMode() {
    this.isLoggingMode = !this.isLoggingMode;
    
  }
  onSubmit (form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    
    
    
    this.isLoading = true;
   
    if (this.isLoggingMode) {
      // authObs = this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({email:email, password:password}))
    } else {
    this.store.dispatch(new AuthActions.SignupStart({email:email,password:password}))
    }
    form.reset();

  }
  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError())
 }

 ngOnDestroy(): void {
   if (this._closeSubscription) {
     this._closeSubscription.unsubscribe();
   }
   if (this.storeSub) {
     this.storeSub.unsubscribe
   }
     
 }
 
 private showErrorAlert(message: string) {
  // const alertCmp = new AlertComponent();
  const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
    AlertComponent
  );
  const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

  const componentRef = hostViewContainerRef.createComponent(alertCmpFactory)

  componentRef.instance.message = message;
  this._closeSubscription = componentRef.instance.close.subscribe(() => {
    this._closeSubscription.unsubscribe();
    hostViewContainerRef.clear();

  })
  
 };

}
