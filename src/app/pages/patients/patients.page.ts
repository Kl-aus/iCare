import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import { BackendDataService } from '../../service/backend-data.service';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {Data, Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {DataService} from '../../service/data.service';
const PATIENT_KEY = 'patientId';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})

export class PatientsPage {
  items = [];
  patientSelected: number;
  searchTerm: string;

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(private backend: BackendDataService,
              private dataService: DataService,
              private toastCtrl: ToastController,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private router: Router,
              private authService: AuthenticationService) { }


  async ionViewWillEnter() {
    await this.getPatients();
  }

  async selectItem(item) {
    this.patientSelected = parseInt(item.patientId,10);
    await this.dataService.save(PATIENT_KEY, item.patientId)
      .then(r => {
        console.log('patient selected, id: ' + this.patientSelected);
      }).catch(error => {
        alert('error while saving patient: '+ error);
      });
  }

  addPatient() {
    this.router.navigateByUrl('/patient-details', {replaceUrl: true});
  }

  deletePatient() {
    this.backend.deletePatient(this.patientSelected).subscribe(async (data: any) => {
      const alert = await this.alertController.create({
        header: 'Patient gelöscht:',
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

  async getPatients() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.items = []; //clear list to avoid duplicated entries
    await this.backend.getPatients().subscribe(async (data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
      }
      await loading.dismiss();
    }, async error => {
      console.log(error);
      await loading.dismiss();
    });
    this.patientSelected = await this.dataService.get(PATIENT_KEY);
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }

}
