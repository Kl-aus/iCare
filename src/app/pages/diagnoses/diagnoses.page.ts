import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BackendDataService} from '../../service/backend-data.service';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {NavParams, ToastController} from '@ionic/angular';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';
import {DataService} from '../../service/data.service';

const DIAGNOSES_KEY = 'diagnoses';
const PATIENT_KEY = 'patientId';

@Component({
  selector: 'app-diagnoses',
  templateUrl: './diagnoses.page.html',
  styleUrls: ['./diagnoses.page.scss'],
})

export class DiagnosesPage implements OnInit, AfterViewInit {
  searchTerm: string;
  items = [];
  selectedItems = [];

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(private backend: BackendDataService,
              private dataService: DataService,
              private toastCtrl: ToastController,
              private authService: AuthenticationService,
              private router: Router) { }

  async ngOnInit() {
  }

  ngAfterViewInit() {

  }

  async ionViewWillEnter() {
    this.items = [];
    this.selectedItems = [];
    console.log('items array after Enter DIAGNOSES PAGE: '+ JSON.stringify(this.items));
    console.log('selecteditems array after Enter DIAGNOSES PAGE: '+ JSON.stringify(this.selectedItems));

    const selectedPatientId = await this.dataService.get(PATIENT_KEY);
    await this.backend.getPatientDiagnoses(selectedPatientId).subscribe((data: any) => {
      for(let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });
  }

  async ionViewWillLeave() {
    // console.log('items array on leave DIAGNOSES PAGE: '+ JSON.stringify(this.items));
    console.log('selecteditems array on leave DIAGNOSES PAGE: '+ JSON.stringify(this.selectedItems));
  }

  selectItem(item) {
    if(!this.selectedItems.includes(item)) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
    }
  }

  addDiagnose() {
    this.router.navigateByUrl('/choose-diagnose', {replaceUrl: true});
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }

  show() {
    const navParams = {
      state: {
        diagnose: this.selectedItems
      }
    };
    console.log('navParams array on leave DIAGNOSES PAGE: '+ JSON.stringify(navParams));
    this.router.navigate(['/menu/core-functions/core-functions/recommendations'], navParams);
  }
}
