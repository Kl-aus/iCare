import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { UserDetails } from '../helpers/userDetails';


@Injectable({
  providedIn: 'root'
})
export class BackendDataService {
  constructor(private httpClient: HttpClient) {  }

  public dataObservable: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public dataReceived(data: any) {
    this.dataObservable.next(data);
  }


  public getDiagnose() {
    return this.httpClient.get<any>('http://212.227.176.204:8080/diagnoses/all');
    // return this.httpClient.get<any>('http://localhost:8080/diagnoses/all');
  }

  public getPatientDiagnoses(selectedPatientId) {
    return this.httpClient.get<any>('http://212.227.176.204:8080/diagnoses/getPatientDiagnoses',{params: {selectedPatientId}});
    // return this.httpClient.get<any>('http://localhost:8080/diagnoses/getPatientDiagnoses',{params: {selectedPatientId}});
  }

  public postDiagnoses(diagnose: any, selectedPatientId: any): Observable<any> {
    const body = {
      diagnose,
      selectedPatientId
    };
    return this.httpClient.post('http://212.227.176.204:8080/diagnoses/savePatientDiagnoses', body).pipe(
    // return this.httpClient.post('http://localhost:8080/diagnoses/savePatientDiagnoses', body).pipe(
      map((data: any) => data)); //TODO: does nothing?
  }

  public getPatients() {
    const id = UserDetails.id;
    return this.httpClient.get<any>('http://212.227.176.204:8080/patient/byId', {params: {id}});
    // return this.httpClient.get<any>('http://localhost:8080/patient/byId', {params: {id}});
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
    // return this.httpClient.post('http://localhost:8080/patient/create', body).pipe(
    return this.httpClient.post('http://212.227.176.204:8080/patient/create', body).pipe(
      map((data: any) => data));
  }

  public deletePatient(patientId: any) {
    const httpOptions: any = {
      headers: {//overwritten by Interceptor
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json'
      }
    };
    httpOptions.body = {
      patientId,
      userId: UserDetails.id
    };
    return this.httpClient.delete('http://212.227.176.204:8080/patient/delete', httpOptions);
    // return this.httpClient.delete('http://localhost:8080/patient/delete', httpOptions);
  }

  public deletePatientDiagnoses(diagnose: any[], patientId: any) {
    const httpOptions: any = {
      headers: {//overwritten by Interceptor
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json'
      }
    };
    httpOptions.body = {
      selectedPatientId: patientId,
      diagnose
    };
    // return this.httpClient.delete('http://localhost:8080/patient/deleteDiagnoses', httpOptions);
    return this.httpClient.delete('http://212.227.176.204:8080/patient/deleteDiagnoses', httpOptions);
  }

  public getRecommendations(diagnoses: any[]) {
    return this.httpClient.post<any>('http://212.227.176.204:8080/recommendation/byDiagnose', {diagnose: diagnoses});
    // return this.httpClient.post<any>('http://localhost:8080/recommendation/byDiagnose', {diagnose: diagnoses});
  }



  public setTest() {
    return this.httpClient.get<any>('http://212.227.176.204:8080/recommendation/setTest');
    // return this.httpClient.get<any>('http://localhost:8080/recommendation/setTest');
  }
}
