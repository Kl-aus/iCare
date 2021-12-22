import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import {BehaviorSubject, from, of, switchMap} from 'rxjs';
import {filter} from 'rxjs/operators';

//Storage CRUD
@Injectable({
  providedIn: 'root'
})

export class DataService {
private storageReady = new BehaviorSubject(false);

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
  await this.storage.defineDriver(CordovaSQLiteDriver);
  await this.storage.create();
  this.storageReady.next(true);
  }

  async addData(item: any, key: any) {
    const storedData = await this.storage.get(key) || [];
    storedData.push(item);
    return this.storage.set(key, storedData);
  }

  async removeItem(index: any, key: any) {
    const storedData = await this.storage.get(key) || [];
    storedData.splice(index, 1);
    return this.storage.set(key, storedData);
  }

  async clearStorage() {
    await this.storage.clear();
  }

  getData(key: any) {
    this.storageReady.pipe(
      filter(ready => ready),
      switchMap(_=> {
       return from(this.storage.get(key)) || of([]); //empty array as fallback
      })
    );
  }
}
