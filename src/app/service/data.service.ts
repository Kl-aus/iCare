import {Injectable} from '@angular/core';
//import {Storage} from '@ionic/storage-angular';
import {Storage} from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})

 export class DataService {
  /* Ionic Storage v3 CRUD for SQLite (not used at the moment) */

// private storageReady = new BehaviorSubject(false);
//
//   constructor(private storage: Storage) {
//     this.init();
//   }
//
//   async init() {
//   await this.storage.defineDriver(CordovaSQLiteDriver);
//   await this.storage.create();
//   this.storageReady.next(true);
//   }
//
//   async addData(key: any, item: any) {
//     const storedData = await this.storage.get(key) || [];
//     storedData.push(item);
//     return this.storage.set(key, storedData);
//   }
//
//   async removeItem(index: any, key: any) {
//     const storedData = await this.storage.get(key) || [];
//     storedData.splice(index, 1);
//     return this.storage.set(key, storedData);
//   }
//
//   async clearStorage() {
//     await this.storage.clear();
//   }
//
//   getData(key: any) {
//    return this.storageReady.pipe(
//       filter(ready => ready),
//       switchMap(_=> {
//        return from(this.storage.get(key)) || of([]); //empty array as fallback
//       })
//     );
//   }

  /* Capacitor Storage */

  async save(key: string, value: any) {
    await Storage.set({ key, value: JSON.stringify(value) });
  }

  async get(key: string) {
     const item = await Storage.get({key: key});
     return JSON.parse(item.value);
  }

  async remove(key: string) {
    await Storage.remove({ key: key });
  }

}
