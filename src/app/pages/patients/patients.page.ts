import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import { BackendDataService } from '../../service/backend-data.service';
import {AlertController, ToastController} from '@ionic/angular';
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
              private router: Router,
              private authService: AuthenticationService) { }


  async ionViewWillEnter() {
    this.getPatients();
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
        message: data,
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
    this.getPatients();
  }

  async getPatients() {
    this.items = []; //clear list to avoid duplicated entries
    this.backend.getPatients().subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });
    this.patientSelected = await this.dataService.get(PATIENT_KEY);
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }

}
