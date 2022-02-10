import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {BackendDataService} from '../../service/backend-data.service';
import {DataService, PATIENT_ITEM, PATIENT_KEY} from '../../service/data.service';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {AuthenticationService} from '../../service/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-choose-diagnose',
  templateUrl: './choose-diagnose.page.html',
  styleUrls: ['./choose-diagnose.page.scss'],
})
export class ChooseDiagnosePage implements OnInit {
  searchTerm: string;
  items = [];
  selectedItems = [];
  selectedPatientId: number;
  patientItem: any;
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;


  constructor(private backendDataService: BackendDataService,
              private dataService: DataService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private authService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {
    this.backendDataService.diagnosesObservable.subscribe((data: any[]) => {
      this.items = data;
    });
    this.dataService.getData(PATIENT_ITEM).subscribe(async (data: number) => {
      this.patientItem = data;
    }, error => {
      console.log('error loading patient from storage: ' + error);
    });
    // this.route.queryParams.subscribe(params => { //only used for subscribing to params -> detect changes
    //   // if (params && params.diagnose) { //for navigateByUrl
    //   //   this.diagnose = JSON.parse(params.diagnose);
    //   // }
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.patientItem = this.router.getCurrentNavigation().extras.state.patient;
    //   } else {
    //     this.patientItem = {};
    //     this.router.navigateByUrl('/menu/core-functions/core-functions/patients', {replaceUrl: true});
    //   }
    // });
  }

  ngOnInit() {
    this.backendDataService.getDiagnose();
  }

  selectItem(item, event) {
    if(!this.selectedItems.includes(item)) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
    }
    event.stopPropagation();
  }

  async add() {
    this.dataService.getData(PATIENT_KEY).subscribe(async (data: number) => {
      this.selectedPatientId = data;
      if (this.selectedItems.length < 1) {
        const alert = await this.alertController.create({
          header: 'Auswahl',
          message: 'Bitte wählen Diagnosen aus!',
          buttons: ['OK'],
        });
        await alert.present();
      } else {
        await this.backendDataService.postDiagnoses(this.selectedItems, this.selectedPatientId);
      }
    }, error => {
      console.log('error loading patientId from storage: ' + error);
    });
  }

  backButton() {
    // this.router.navigateByUrl('/menu/core-functions/core-functions/diagnoses', {replaceUrl: true});
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }
}
