import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataGvAtService {
  public mapsObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private httpClient: HttpClient) {
  }

  public getAdviceCenters() {
    this.httpClient.get('https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:BERATUNGSZENTROGD&srsName=EPSG:4326&outputFormat=csv', {responseType: 'text'}).subscribe((data: any) => {
      this.mapsObservable.next(data);
    }, error => {
      console.log('Error while fetching data from data.gv.at: ' + JSON.stringify(error.error));
    });
  }
}
