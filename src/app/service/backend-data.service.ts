import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BackendDataService {
  constructor(private httpClient: HttpClient) {  }

  public getDiagnose() {
    return this.httpClient.get<any>('http://localhost:8080/diagnoses/all');
  }

  public getPatients() {
    return this.httpClient.get<any>('http://localhost:8080/patient/all');
  }


  public postPatient(patient: {firstName; lastName; weight; height; age; gender}): Observable<any> {
    return this.httpClient.post('http://localhost:8080/patient/create', patient).pipe(
      map((data: any) => data));
  }

}
