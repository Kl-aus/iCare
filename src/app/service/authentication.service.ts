import {Injectable} from '@angular/core';
import {Storage} from '@capacitor/storage';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, tap} from 'rxjs/operators';
import {UserDetails} from '../helpers/userDetails';
import {DataService} from './data.service';

const PATIENT_KEY = 'patientId';
const DIAGNOSES_KEY = 'diagnoses';
const TOKEN_KEY = 'my-token';
const SETTINGS_KEY ='my-settings';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  accessToken = '';
  userDetails = [];

  constructor(private httpClient: HttpClient, private dataService: DataService) {
    this.loadToken();
  }

  async loadToken() {
    await this.dataService.get(TOKEN_KEY).then(res => {
      this.accessToken = JSON.stringify(res);
    }).catch(error => {
      alert('error while loading token, please log in! ');
    });
    if (this.accessToken.length > 0) {
        console.log('set token:', this.accessToken);
      //TODO: check if token is valid
        this.isAuthenticated.next(true);
      } else {
        this.isAuthenticated.next(false);
      }
  }

  login(credentials: {username; password}): Observable<any> {
    this.userDetails = [];
    return this.httpClient.post('http://localhost:8080/api/auth/signin', credentials).pipe(
      tap((data: any) =>
        this.userDetails.push(data)), //works only with push?! clone json didnt work: data isnt accessable/login doesnt work
      map((data: any) => data.accessToken),
      switchMap(accessToken => from(Storage.set({key: TOKEN_KEY, value: accessToken}))),
      tap(_ => {
        this.saveSettings();
        this.isAuthenticated.next(true);
      }),
    );
  }

  async logout(): Promise<void> {
    this.isAuthenticated.next(false);
    await Storage.remove({key: PATIENT_KEY});
    await Storage.remove({key: DIAGNOSES_KEY});
    await Storage.remove({key: SETTINGS_KEY});
    return await Storage.remove({key: TOKEN_KEY});
  }

  register(credentials: {username; password; email}): Observable<any> {
    return this.httpClient.post('http://localhost:8080/api/auth/signup', credentials).pipe(
      map((data: any) => data));
  }

  async saveSettings() {
    const userDetailsString = this.userDetails[0].username+','+this.userDetails[0].roles
      +','+this.userDetails[0].email+','+this.userDetails[0].id;

    this.dataService.save(SETTINGS_KEY, userDetailsString)
      .then(r => {
      console.log('user details saved');
     }).catch(error => {
       alert('error while saving user details: '+ error);
     });

    UserDetails.username = this.userDetails[0].username;
    UserDetails.roles = this.userDetails[0].roles;
    UserDetails.email = this.userDetails[0].email;
    UserDetails.id = parseInt(this.userDetails[0].id, 10);

    console.log('UserDetails: ' ,  this.userDetails[0]);
  }
}
