import { environment } from '../environments/environment'
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing-module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule} from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule} from '@ngrx/store-devtools'
import { StoreRouterConnectingModule} from '@ngrx/router-store'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CoreModule } from './core.module';
import * as fromApp from './store/app.reducer'
import { AuthEffects } from './auth/store/auth.effects';
import { RecipeEffects } from './recipe/store/recipe.effect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([AuthEffects,RecipeEffects]),
    StoreModule.forRoot(fromApp.appReducer),
    StoreDevtoolsModule.instrument({logOnly:environment.production}),
    StoreRouterConnectingModule.forRoot(),
  ],
  // providers: [
  // LoggingService
  // ],
  
  bootstrap: [AppComponent],
 
})
export class AppModule { }
