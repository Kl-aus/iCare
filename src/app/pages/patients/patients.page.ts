import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import { BackendDataService } from '../../service/backend-data.service';
import {ToastController} from '@ionic/angular';
import {Data, Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {DataService} from '../../service/data.service';
const PATIENT_KEY = 'patientId';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})

export class PatientsPage implements OnInit {
  items = [];
  patientSelected: number;
  searchTerm: string;

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(private backend: BackendDataService,
              private dataService: DataService,
              private toastCtrl: ToastController,
              private router: Router,
              private authService: AuthenticationService) { }

  ngOnInit() {

  }

  async ionViewWillEnter(){
    this.items = []; //clear list to avoid duplicated entries
    this.backend.getPatients().subscribe((data: any) => {
      for(let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });
    this.patientSelected = await this.dataService.get(PATIENT_KEY);
  }

  async selectItem(item) {
    this.patientSelected = parseInt(item.patientId,10);
    await this.dataService.save(PATIENT_KEY, item.patientId)
      .then(r => {
        console.log('patient saved');
      }).catch(error => {
        alert('error while saving patient: '+ error);
      });
    const selectedPatientId = await this.dataService.get(PATIENT_KEY);
  }

  addPatient() {
    this.router.navigateByUrl('/patient-details', {replaceUrl: true});
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }
}
