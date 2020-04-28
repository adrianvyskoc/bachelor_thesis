import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';

import { LoginModule } from './login/login.module';
import { SharedModule } from './shared/modules/shared.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDOsr37PY7B5MvA8TqYjqL1IAf5c6qranc' + '&libraries=visualization'
    }),

    HttpClientModule,
    FormsModule,
    CoreModule,
    AppRoutingModule,
    LoginModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
