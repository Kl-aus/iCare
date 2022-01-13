import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataGvAtService {

  constructor(private httpClient: HttpClient) { }

  public getAdviceCenters() {
    return this.httpClient.get('https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:BERATUNGSZENTROGD&srsName=EPSG:4326&outputFormat=csv', {responseType: 'text'});
  }
}
