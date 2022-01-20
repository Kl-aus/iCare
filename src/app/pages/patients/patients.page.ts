import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import { BackendDataService } from '../../service/backend-data.service';
import { LoadingController, ToastController} from '@ionic/angular';
import { Router} from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { Storage } from '@capacitor/storage';
import {DataService} from '../../service/data.service';

const PATIENT_KEY = 'patientId';
const TEST = 'test';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})

export class PatientsPage implements OnInit{
  items = [];
  patientSelected: number;
  searchTerm: string;
  selectedItemIndex: number;
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(private backendDataService: BackendDataService,
              private toastCtrl: ToastController,
              private dataService: DataService,
              private loadingController: LoadingController,
              private router: Router,
              private authService: AuthenticationService) {
    this.backendDataService.getPatients();
  }

  ngOnInit(): void {
    this.backendDataService.patientsObservable.subscribe((data: any[]) => {
      this.items = data;
    });
  }

  ionViewDidEnter() {

  }

  async selectItem(item, i) {
    this.selectedItemIndex = i;
    this.patientSelected = parseInt(item.patientId,10);
    await Storage.set({key: PATIENT_KEY, value: item.patientId})
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
    this.backendDataService.deletePatient(this.patientSelected);
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }

}
