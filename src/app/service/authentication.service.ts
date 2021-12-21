import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, tap} from 'rxjs/operators';
import {Settings} from '../helpers/settings';
const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  accessToken = '';
  request= [];

  constructor(private httpClient: HttpClient) {
    this.loadToken();
  }
  async loadToken() {
    const accessToken = await Storage.get({key: TOKEN_KEY});
    if (accessToken && accessToken.value) {
      console.log('set token:', accessToken.value);
      this.accessToken = accessToken.value; //TODO: check if token is valid
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: {username; password}): Observable<any> {
    //TODO: global const for url
    return this.httpClient.post('http://localhost:8080/api/auth/signin', credentials).pipe(
      tap((data: any) =>
        this.request.push(data)), //works only with push?! clone json didnt work: data isnt accessable/login doesnt work
      map((data: any) => data.accessToken),
      switchMap(accessToken => from(Storage.set({key: TOKEN_KEY, value: accessToken}))),
      tap(_ => {
        this.loadSettings();
        this.isAuthenticated.next(true);
      }),
    );
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({key: TOKEN_KEY});
  }

  register(credentials: {username; password; email}): Observable<any> {
    return this.httpClient.post('http://localhost:8080/api/auth/signup', credentials).pipe(
      map((data: any) => data));
  }

  loadSettings() {
    Settings.username = this.request[0].username;
    Settings.roles = this.request[0].roles;
    Settings.email = this.request[0].email;
    Settings.id = this.request[0].id;
    console.log('Current Role:' + Settings.roles);
  }
}
