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
  userDetails: any;

  constructor(private httpClient: HttpClient, private dataService: DataService) {
    this.loadToken();
  }

  async loadToken() {
      await Storage.get({key: TOKEN_KEY}).then(async  res => {
        this.accessToken = res.value;
        if (this.accessToken) {
          console.log('LOAD TOKEN: not null ' + this.accessToken);
          await this.loadSettings().then(()=> {
            this.isAuthenticated.next(true);
          });
        } else {
          console.log('LOAD TOKEN: null ' + this.accessToken);
          this.isAuthenticated.next(false);
        }
    }).catch(error => {
        console.log('Storage get error: '+ error);
    });
  }

  login(credentials: {username; password}): Observable<any> {
    this.userDetails = [];
    return this.httpClient.post('http://localhost:8080/api/auth/signin', credentials).pipe(
      tap((data: any) =>
        this.userDetails.push(data)), //works only with push?! clone json didnt work: data isnt accessable/login doesnt work
      map((data: any) => data.accessToken),
      switchMap(accessToken => from(Storage.set({key: TOKEN_KEY, value: accessToken}))),
      tap(async _ => {
        await this.loadToken();
        await this.saveSettings();
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
    // await this.dataService.save(SETTINGS_KEY, this.userDetails);
     await Storage.set({key: SETTINGS_KEY, value: this.userDetails})
      .then(r => {
      console.log('user details saved', JSON.stringify(UserDetails));
     }).catch(error => {
        console.log('error while saving user details: '+ error);
     });
    console.log('USER DETAILS : ' + UserDetails.id + '' + UserDetails.username);
  }

  async loadSettings() {
    await Storage.get({key: SETTINGS_KEY})
      .then(res => {
        console.log(this.userDetails);
      }).catch(error => {
        console.log('user details not loaded, please log in');
      });
  }
}
