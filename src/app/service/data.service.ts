import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Storage } from '@ionic/storage-angular';
import { filter, switchMap } from 'rxjs/operators';
import { UserDetailsModel } from '../models/userDetailsModel';

export const TOKEN_HEADER_KEY = 'Authorization';
export const PATIENT_KEY = 'patientId';
export const DIAGNOSES_KEY = 'diagnoses';
export const TOKEN_KEY = 'my-token';
export const SETTINGS_KEY ='my-settings';
export const PATIENT_ITEM = 'patientItem';
export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root'
})
 export class DataService {
  userDetailsModel: UserDetailsModel  = null;
  diagnosesTabDisabled = new BehaviorSubject(true);//TODO

  /* Ionic Storage v3*/
  public diagnosesTab = new BehaviorSubject(true);
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
      })))
    );
  }
}
