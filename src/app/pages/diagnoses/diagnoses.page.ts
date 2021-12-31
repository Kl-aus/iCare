import {Component, OnInit, ViewChild} from '@angular/core';
import {BackendDataService} from '../../service/backend-data.service';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {ToastController} from '@ionic/angular';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';
import {DataService} from '../../service/data.service';
import {of} from "rxjs";

const DIAGNOSES_KEY = 'diagnoses';
const PATIENT_KEY = 'patientId';

@Component({
  selector: 'app-diagnoses',
  templateUrl: './diagnoses.page.html',
  styleUrls: ['./diagnoses.page.scss'],
})

export class DiagnosesPage implements OnInit {
  searchTerm: string;
  // TODO Respone Klasse
  items = [];
  selectedItems = [];

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;


  constructor(private backend: BackendDataService,
              private dataService: DataService,
              private toastCtrl: ToastController,
              private authService: AuthenticationService,
              private router: Router) { }

  async ngOnInit() {
    const selectedPatientId = await this.dataService.get(PATIENT_KEY);
    this.backend.getPatientDiagnoses(selectedPatientId).subscribe((data: any) => {
      for(let i = 0; i < data.length; i++) {
          this.items.push(data[i]);
          this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });
  }

  async ionViewWillEnter() {
    this.items = [];
    const selectedPatientId = await this.dataService.get(PATIENT_KEY);
    this.backend.getPatientDiagnoses(selectedPatientId).subscribe((data: any) => {
      console.log('data array:' + data);
      for(let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });
    console.log('Items array:' + JSON.stringify(this.items));
  }

  async ionViewWillLeave() {
  }


  selectItem(item) {
  }


  addDiagnose() {
    this.router.navigateByUrl('/choose-diagnose', {replaceUrl: true});
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }

}
