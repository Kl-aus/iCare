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
    this.dataService.getData(TOKEN_KEY).subscribe(async  res => {
      this.accessToken = res;
      if (this.accessToken) {
        await this.loadSettings().then(()=> {
          this.isAuthenticated.next(true);
        });
      } else {
        this.isAuthenticated.next(false);
      }
    },error => {
      console.log('Storage get error: '+ error);
    });
  }

  // login(credentials: {username; password}): Observable<any> {
  //   this.userDetails = [];
  //   return this.httpClient.post('http://localhost:8080/api/auth/signin', credentials).pipe(
  //     tap((data: any) =>
  //       this.userDetails.push(data)),
  //     map((data: any) => data.accessToken),
  //     switchMap(accessToken => this.dataService.saveData(TOKEN_KEY, accessToken)),
  //     tap(async _ => {
  //       await this.loadToken();
  //       await this.saveSettings();
  //       await this.loadSettings();
  //       this.isAuthenticated.next(true);
  //     }),
  //   );
  // }

  login(credentials: {username; password}): Observable<any> {
    this.userDetails = [];
    return this.httpClient.post('http://localhost:8080/api/auth/signin', credentials).pipe(
      map((data: any) => this.dataService.userDetailsModel = data),
      switchMap( _=> this.dataService.saveData(TOKEN_KEY, this.dataService.userDetailsModel.accessToken)),
      tap(async _=> {
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
    await this.dataService.saveData(SETTINGS_KEY, this.dataService.userDetailsModel).subscribe((data: any) =>{
      console.log('user data saved');
    }, error => {
      console.log('error saving user data' + error);
    });
  }

  async loadSettings() {
   await this.dataService.loadUserDetails().subscribe(_=>{
    }, error => {
      console.log('error loading user data' + error);
    });
  }
}
