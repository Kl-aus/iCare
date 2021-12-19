import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BackendDataService {
  constructor(private httpClient: HttpClient) {  }

  public getDiagnose() {
    return this.httpClient.get<any>('http://localhost:8080/diagnoses/all');
  }
}
