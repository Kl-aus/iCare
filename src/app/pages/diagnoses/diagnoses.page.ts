import {AfterContentChecked, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {BackendDataService} from '../../service/backend-data.service';
import {ActionSheetController, AlertController, ToastController} from '@ionic/angular';
import {AuthenticationService} from '../../service/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService, PATIENT_ITEM, PATIENT_KEY} from '../../service/data.service';
import {SwiperComponent} from 'swiper/angular';
import {SwiperOptions} from 'swiper';

@Component({
  selector: 'app-diagnoses',
  templateUrl: './diagnoses.page.html',
  styleUrls: ['./diagnoses.page.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class DiagnosesPage implements AfterContentChecked{
  @ViewChild('swiper') swiper: SwiperComponent;

  searchTerm: string;
  items = [];
  selectedItems = [];
  selectedPatientId = 0;
  hideContent = true;
  message = '';
  patientItem: any;
  segmentType: 'Allgemein';

  config: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 30,
    centeredSlides: true,
  };

  constructor(private backendDataService: BackendDataService,
              private dataService: DataService,
              private toastCtrl: ToastController,
              private alertController: AlertController,
              private authService: AuthenticationService,
              private actionSheetController: ActionSheetController,
              private route: ActivatedRoute,
              private router: Router) {
    this.backendDataService.patientDiagnosesObservable.subscribe((data: any[]) => {
      this.items = [];
      this.selectedItems = [];
      this.items = data;

      if(this.items.length > 0) {
            this.hideContent = false;
            this.message = '';
          } else {
            this.hideContent = true;
            this.message = 'Bitte wählen Sie zuerst einen Patienten und fügen Sie danach Diagnosen hinzu!';
          }
    }, error => { //TODO Error handling data = null (switch to page without choosen patient)
          console.log(error);
    });
  }

  //swiper not implemented right -- update swiper for "snapping behaviour"
  ngAfterContentChecked(): void {
    if (this.swiper) { //check if swiper is defined
      this.swiper.updateSwiper({});
    }
  }

  async ionViewWillEnter() {
    this.dataService.getData(PATIENT_ITEM).subscribe(result => {
      this.patientItem = result;
    }, error => {
      console.log('get patientItem failed ' + error);
    });

    this.dataService.getData(PATIENT_KEY).subscribe(result => {
      this.selectedPatientId = result;
    }, error => {
      console.log('get patientId failed ' + error);
    });
    await this.getPatientDiagnoses();
  }

  ionViewWillLeave() {
    this.message = '';
    this.hideContent = true;
  }

  async getPatientDiagnoses() {
    await this.backendDataService.getPatientDiagnoses();
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

  async deleteDiagnose() {
    this.backendDataService.deletePatientDiagnoses(this.selectedItems, this.selectedPatientId);
  }

  show() {
    const navParams = {
      state: {
        diagnose: this.selectedItems
      }
    };
    // this.router.navigate(['/menu/core-functions/core-functions/recommendations'], navParams);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Wählen Sie eine Aktion!',
      cssClass: 'actionSheet-class',
      mode: 'ios',
      buttons: [{
        text: 'Zeige Empfehlung',
        icon: 'share',
        role: 'searchbutton',
        data: 10,
        handler: () => {
          this.show();
        }
      },  {
        text: 'Diagnosen hinzufügen',
        icon: 'add-circle',
        data: 'Data value',
        handler: () => {
          this.addDiagnose();
        }
      }, {
        text: 'Diagnosen löschen',
        //role: 'destructive',
        icon: 'trash',
        id: 'delete-button',
        data: {
          type: 'delete'
        },
        handler: () => {
          this.deleteDiagnose();
        }
      }, {
        text: 'zurück',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          actionSheet.dismiss();
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
  }

  backButton() {
    this.router.navigateByUrl('menu/care/patient-dashboard', {replaceUrl: true});
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }

}
