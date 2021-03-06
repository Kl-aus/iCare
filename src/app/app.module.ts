import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouteReuseStrategy, Routes} from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Drivers } from '@ionic/storage';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {authInterceptorProviders} from './helpers/auth.interceptor';
import {IonicStorageModule} from '@ionic/storage-angular';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    IonicStorageModule.forRoot({
    name: 'mydb',
    driverOrder: [CordovaSQLiteDriver._driver ,Drivers.IndexedDB, Drivers.LocalStorage]
  })],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
