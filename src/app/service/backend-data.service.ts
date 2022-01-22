import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {async, BehaviorSubject} from 'rxjs';
import { UserDetails } from '../helpers/userDetails';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {DataService} from './data.service';

const PATIENT_KEY = 'patientId';


@Injectable({
  providedIn: 'root'
})
export class BackendDataService {
  public patientsObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public patientDiagnosesObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public diagnosesObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public recommendationsObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


  constructor(private httpClient: HttpClient,
              private dataService: DataService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private router: Router) {  }

  /*########## Diagnose requests ##########*/

  public getDiagnose() {//212.227.176.204
    return this.httpClient.get<any>('http://localhost:8080/diagnoses/all').subscribe((data: any) => {
      this.diagnosesObservable.next(data);
    });
  }

  public getPatientDiagnoses() {
    this.dataService.getData(PATIENT_KEY).subscribe((data: number) => {
      const selectedPatientId = data;
      this.httpClient.get<any>('http://localhost:8080/diagnoses/getPatientDiagnoses',{params: {selectedPatientId}}).subscribe((res: any) => {
        this.patientDiagnosesObservable.next(res);
      }, error => {
        console.log('error fetching patientdiagnoses form backend: ' + JSON.stringify(error));
      });
    }, error => {
      console.log('error loading patientId from storage: ' + error);
    });
  }

  public async postDiagnoses(diagnose: any, selectedPatientId: any) {
    const diagnoses = {
      diagnose,
      selectedPatientId
    };
    const loading = await this.loadingController.create();
    await loading.present();
    this.httpClient.post('http://localhost:8080/diagnoses/savePatientDiagnoses', diagnoses).subscribe(async res => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Diagnosen hinzugefügt',
          message: 'Bitte wählen Sie nun die Pflegediagnosen aus um Pflegeempfehlungen anzuzeigen',
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigateByUrl('/menu/core-functions/core-functions/diagnoses', {replaceUrl: true});
      },
      async (res) => {
        console.log('post Diagnose error: ' + res);
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Erstellen fehlgeschlagen',
          //message: res.error.error,
          message: 'Überprüfen Sie Eingabedaten und Internetverbindung',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
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
    return this.httpClient.delete('http://localhost:8080/patient/deleteDiagnoses', httpOptions).subscribe(async (data: any) => {
      const alert = await this.alertController.create({
        header: 'Diagnose gelöscht:',
        message: '',
        buttons: ['OK'],
      });
      await this.getPatientDiagnoses();
      await alert.present();
    }, async error => {
      const alert = await this.alertController.create({
        header: 'Fehler',
        message: 'Bitte überprüfen Sie Ihre Internetverbindung und probieren sie es nochmal!',
        buttons: ['OK'],
      });
      await alert.present();
    });
  }

  /*########## Patient requests ##########*/
  public getPatients() {
    console.log('USER id backenddata: ' + this.dataService.userDetailsModel.id);
    const id = this.dataService.userDetailsModel.id;
    this.httpClient.get<any>('http://localhost:8080/patient/byId', {params: {id}}).subscribe((data: any) => {
       this.patientsObservable.next(data);
    }, error => {
       console.log(error);
     });
  }

  public postPatient(patient: {firstName; lastName; weight; height; age; gender}) {
    const body = {
      firstName: patient.firstName,
      lastName: patient.lastName,
      weight: patient.weight,
      height: patient.height,
      age: patient.age,
      gender: patient.gender,
      userId: UserDetails.id
    };

    this.httpClient.post('http://localhost:8080/patient/create', body).subscribe(async res => {
        const alert = await this.alertController.create({
          header: 'Patient erstellt',
          //message: res.error.error,
          message: 'Bitte wählen Sie nun zuerst den Patient und dann die Pflegediagnosen aus',
          buttons: ['OK'],
        });
        await alert.present();
        await this.router.navigateByUrl('/menu/core-functions/core-functions/patients', {replaceUrl: true});
      },
      async (res) => {
        const alert = await this.alertController.create({
          header: 'Erstellen fehlgeschlagen',
          //message: res.error.error,
          message: 'Überprüfen Sie Eingabedaten und Internetverbindung',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
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
    this.httpClient.delete('http://localhost:8080/patient/delete', httpOptions).subscribe(async (data: any) => {
      this.getPatients();
      const alert = await this.alertController.create({
        header: 'Patient gelöscht',
        message: '',
        buttons: ['OK'],
      });
      await alert.present();
    }, async error => {
      const alert = await this.alertController.create({
        header: 'Fehler',
        message: 'Bitte überprüfen Sie Ihre Internetverbindung und probieren sie es nochmal!',
        buttons: ['OK'],
      });
      await alert.present();
    });
  }

  /*########## Nursing Measure requests ##########*/
  public getRecommendations(diagnoses: any[]) {
    this.httpClient.post<any>('http://localhost:8080/recommendation/byDiagnose', {diagnose: diagnoses}).subscribe((data: any) => {
     this.recommendationsObservable.next(data);
    });
  }
  /*########## Moderator requests ##########*/


  public saveRecommendation(authorInfo: any, diagnose: any, nursingMeasures: any[]) { //pass objects here ?! this.diagnose ...
    const body = {
      name: authorInfo._name,
      author: authorInfo._author,
      nursingDiagnosesNanda: diagnose._nursingDiagnosesNanda,
      nursingDiagnosesDescription: diagnose._nursingDiagnosesDescription,
      nursingMeasures: nursingMeasures
    };

    this.httpClient.post<any>('http://localhost:8080/recommendation/save', body).subscribe(async (data: any) => {
      const alert = await this.alertController.create({
        header: 'Pflegeempfehlung gespeichert',
        message: '',
        buttons: ['OK'],
      });
      await alert.present();
    }, async error => {
        const alert = await this.alertController.create({
          header: 'Fehler',
          message: 'Bitte überprüfen Sie Ihre Internetverbindung und probieren sie es nochmal!',
          buttons: ['OK'],
        });
        await alert.present();
      });
    }
}
