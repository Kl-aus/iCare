import {Injectable} from '@angular/core';
// import {Storage} from '@capacitor/storage';
import {BehaviorSubject, from, of} from 'rxjs';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import {Storage} from '@ionic/storage-angular';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {UserDetailsModel} from '../models/userDetailsModel';

@Injectable({
  providedIn: 'root'
})
 export class DataService {
  userDetailsModel: UserDetailsModel  = null;

  /* Ionic Storage v3*/
  public userDetailsReadyObservable = new BehaviorSubject(false);
  private storageReadyObservable = new BehaviorSubject(false);

  constructor(private storage: Storage) {
    this.init();
  }

  callDataServiceConstructor() {
    console.log('loadDataService...');
  }

  async init() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create().then(_ => {
      this.storageReadyObservable.next(true);
    }, error => {
      console.log('create storage failed: ' + error);
    });
  }

  async addDatatoArray(key: any, item: any) {
    const storedData = await this.storage.get(key) || [];
    storedData.push(item);
    return this.storage.set(key, storedData);
  }

  async removeItemFromArray(index: any, key: any) {
    const storedData = await this.storage.get(key) || [];
    storedData.splice(index, 1);
    return this.storage.set(key, storedData);
  }

  saveData(key: any, item: any) {
    return this.storageReadyObservable.pipe(
      filter(ready => ready),
      switchMap(_ => from(this.storage.set(key, item)))
    );
  }

  removeData(key: any) {
    return this.storageReadyObservable.pipe(
      filter(ready => ready),
      switchMap(_ => from(this.storage.remove(key)))
    );
  }

  async clearStorage() {
    await this.storage.clear();
  }

  getData(key: any) {
    return this.storageReadyObservable.pipe(
      filter(ready => ready),
      switchMap(_ => from(this.storage.get(key)))
    );
  }

  loadUserDetails() {
    return this.storageReadyObservable.pipe(
      filter(ready => ready),
      switchMap(_ => from(this.storage.get('my-settings').then(data => {
        this.userDetailsModel = data;
      }))),
      tap( _=> this.userDetailsReadyObservable.next(true))
    );
  }
}
