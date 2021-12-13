import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouteReuseStrategy, Routes} from '@angular/router';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ReactiveFormsModule, FormsModule  } from '@angular/forms';



import { HttpClientModule } from '@angular/common/http';
import { LoginPipe } from './pages/login.pipe';
import { RegisterPipe } from './pages/register.pipe';
import { ProfilePipe } from './pages/profile.pipe';

@NgModule({
  declarations: [AppComponent, LoginPipe, RegisterPipe, ProfilePipe],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
