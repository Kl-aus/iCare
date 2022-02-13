import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import { BackendDataService } from '../../service/backend-data.service';
import { LoadingController, ToastController} from '@ionic/angular';
import { Router} from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import {DataService, PATIENT_ITEM, PATIENT_KEY} from '../../service/data.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})

export class PatientsPage implements OnInit{
  items = [];
  patientSelected: number;
  searchTerm: string;
  patientItem: any;

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(private backendDataService: BackendDataService,
              private toastCtrl: ToastController,
              private dataService: DataService,
              private loadingController: LoadingController,
              private router: Router,
              private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.backendDataService.patientsObservable.subscribe((data: any[]) => {
      this.items = data;
    });
  }

  ionViewDidEnter() {
    this.backendDataService.getPatients();
    this.dataService.diagnosesTab.next(true);
  }

  async selectItem(item) {
    this.dataService.saveData(PATIENT_ITEM, item).subscribe(result => {
      console.log('patient saved');
    }, error => {
      console.log('save patientId failed ' + error);
    });
    this.patientSelected = parseInt(item.patientId,10);
    this.dataService.saveData(PATIENT_KEY, this.patientSelected).subscribe(result => {
      this.router.navigateByUrl('menu/care/patient-dashboard', {replaceUrl: true});
    }, error => {
      console.log('save patientId failed ' + error);
    });
    this.dataService.diagnosesTab.next(false);
  }

  addPatient() {
    this.router.navigateByUrl('menu/care/patient-details', {replaceUrl: true});
  }

  deletePatient(item) {
    this.backendDataService.deletePatient(parseInt(item.patientId,10));
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }
}
