import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BackendDataService} from '../../service/backend-data.service';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {ActionSheetController, AlertController, NavParams, ToastController} from '@ionic/angular';
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

export class DiagnosesPage {
  searchTerm: string;
  items = [];
  selectedItems = [];
  selectedPatientId = 0;

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(private backend: BackendDataService,
              private dataService: DataService,
              private toastCtrl: ToastController,
              private alertController: AlertController,
              private authService: AuthenticationService,
              private actionSheetController: ActionSheetController,
              private router: Router) { }

  async ionViewWillEnter() {
    this.selectedPatientId = await this.dataService.get(PATIENT_KEY);
    await this.getPatientDiagnoses();
  }

  getPatientDiagnoses() {
    this.items = [];
    this.selectedItems = [];
    this.backend.getPatientDiagnoses(this.selectedPatientId).subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });
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

  deleteDiagnose() {
    this.backend.deletePatientDiagnoses(this.selectedItems, this.selectedPatientId).subscribe(async (data: any) => {
      const alert = await this.alertController.create({
        header: 'Diagnose gelöscht:',
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
    this.getPatientDiagnoses();
    this.items = [...this.items]; //Clone Array for updating Viewport
  }

  show() {
    const navParams = {
      state: {
        diagnose: this.selectedItems
      }
    };
    this.router.navigate(['/menu/core-functions/core-functions/recommendations'], navParams);
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
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }


}
