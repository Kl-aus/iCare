import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {DataService, PATIENT_KEY} from './data.service';

// const url = 'http://localhost:8080';
const url = 'http://212.227.176.204:8080';

@Injectable({
  providedIn: 'root'
})
export class BackendDataService {
  public patientsObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public patientDiagnosesObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public diagnosesObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public recommendationsObservable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public imageObservable: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(private httpClient: HttpClient,
              private dataService: DataService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private router: Router) {  }

  /*########## Diagnose requests ##########*/

  public getDiagnose() {
    return this.httpClient.get<any>(url + '/diagnoses/all').subscribe((data: any) => {
      this.diagnosesObservable.next(data);
    });
  }

  public getPatientDiagnoses() {
    this.dataService.getData(PATIENT_KEY).subscribe((data: number) => {
      const selectedPatientId = data;
      this.httpClient.get<any>(url + '/diagnoses/getPatientDiagnoses',
        {params: {selectedPatientId}}).subscribe((res: any) => {
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
    this.httpClient.post(url + '/diagnoses/savePatientDiagnoses', diagnoses).subscribe(async res => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Diagnosen hinzugefügt',
          message: 'Bitt wähle nun die Pflegediagnosen aus um Pflegeempfehlungen anzuzeigen',
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
          message: 'Überprüfe deine Eingabedaten und Internetverbindung',
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
    return this.httpClient.delete(url + '/patient/deleteDiagnoses', httpOptions).subscribe(async (data: any) => {
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
        message: 'Bitte überprüfe deine Internetverbindung und probiere es nochmal!',
        buttons: ['OK'],
      });
      await alert.present();
    });
  }

  /*########## Patient requests ##########*/
  public getPatients() {
    const id = this.dataService.userDetailsModel.id;
    this.httpClient.get<any>(url + '/patient/byId', {params: {id}}).subscribe((data: any) => {
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
      userId: this.dataService.userDetailsModel.id,
    };

    this.httpClient.post(url + '/patient/create', body).subscribe(async res => {
        const alert = await this.alertController.create({
          header: 'Patient erstellt',
          //message: res.error.error,
          message: 'Bitte wähle nun zuerst den Patient und dann die Pflegediagnosen aus',
          buttons: ['OK'],
        });
        await alert.present();
        await this.router.navigateByUrl('/menu/core-functions/core-functions/patients', {replaceUrl: true});
      },
      async (res) => {
        const alert = await this.alertController.create({
          header: 'Erstellen fehlgeschlagen',
          //message: res.error.error,
          message: 'Überprüfe dine Eingabedaten und Internetverbindung',
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
      userId: this.dataService.userDetailsModel.id,
    };
    this.httpClient.delete(url + '/patient/delete', httpOptions).subscribe(async (data: any) => {
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
        message: 'Bitte überprüfe deine Internetverbindung und probiere es nochmal!',
        buttons: ['OK'],
      });
      await alert.present();
    });
  }

  /*########## Nursing Measure requests ##########*/
  public getRecommendations(diagnoses: any[]) {
    this.httpClient.post<any>(url + '/recommendation/byDiagnose', {diagnose: diagnoses}).subscribe((data: any) => {
      this.recommendationsObservable.next(data);
    }, async error => {
      const alert = await this.alertController.create({
        header: 'Fehler',
        message: 'Um Empfehlungen zu sehen musst du Diagnosen auswählen!',
        buttons: ['OK'],
      });
      await alert.present();
    });
  }


  /*########## Moderator requests ##########*/

  public async saveRecommendation(authorInfo: any, diagnose: any, nursingMeasure: any) {
    const body = { //TODO: send objects, not variables...
      // eslint-disable-next-line no-underscore-dangle
      name: authorInfo._name,
      // eslint-disable-next-line no-underscore-dangle
      author: authorInfo._author,
      // eslint-disable-next-line no-underscore-dangle
      nursingDiagnosesNanda: diagnose._nursingDiagnosesNanda,
      // eslint-disable-next-line no-underscore-dangle
      nursingDiagnosesDescription: diagnose._nursingDiagnosesDescription,
      nursingMeasure
    };
    this.httpClient.post<any>(url + '/recommendation/save', body).subscribe(async (data: any) => {
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

  public saveImages(formData) {
    this.httpClient.post(url + '/files/saveImg', formData).subscribe(async (data: any) => {
      console.log('Images uploaded, ' + data);
    }, async error => {
      console.log('upload error, ' + error);
    });
  }


  public getImages(filename) {
    return this.httpClient.get(url + '/files/getImg', {params: {filename}, responseType: 'blob'});
  }
}
