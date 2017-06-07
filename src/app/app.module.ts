import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing,
         appRoutingProviders } from './app.routing';

import { AppComponent }  from './app.component';
import { HomeComponent } from './views/home/home.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { HeaderComponent } from './common/header/header.component';

@NgModule({
  imports: [ BrowserModule, routing ],
  declarations: [ AppComponent,
                  HomeComponent,
                  HeaderComponent,
                  PageNotFoundComponent ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
