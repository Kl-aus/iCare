import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { UserDetails } from '../helpers/userDetails';


@Injectable({
  providedIn: 'root'
})
export class BackendDataService {
  constructor(private httpClient: HttpClient) {  }

  public getDiagnose() {
    return this.httpClient.get<any>('http://localhost:8080/diagnoses/all');
  }

  public getPatients() {
    const id = UserDetails.id;
    return this.httpClient.get<any>('http://localhost:8080/patient/byId', {params: {id}});
  }

  public postPatient(patient: {firstName; lastName; weight; height; age; gender}): Observable<any> {
    const body = {
      firstName: patient.firstName,
      lastName: patient.lastName,
      weight: patient.weight,
      height: patient.height,
      age: patient.age,
      gender: patient.gender,
      userId: UserDetails.id
    };

    return this.httpClient.post('http://localhost:8080/patient/create', body).pipe(
      map((data: any) => data));
  }
}
