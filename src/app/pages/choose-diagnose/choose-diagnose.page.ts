import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {BackendDataService} from '../../service/backend-data.service';
import {DataService} from '../../service/data.service';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';

const PATIENT_KEY = 'patientId';

@Component({
  selector: 'app-choose-diagnose',
  templateUrl: './choose-diagnose.page.html',
  styleUrls: ['./choose-diagnose.page.scss'],
})
export class ChooseDiagnosePage implements OnInit {
  searchTerm: string;
  // TODO Respone Klasse
  items = [];
  selectedItems = [];
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;


  constructor(private backend: BackendDataService,
              private dataService: DataService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private toastCtrl: ToastController,
              private authService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    this.backend.getDiagnose().subscribe((data: any) => {
      for(let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });

  }


  async ionViewDidEnter() {
    this.items = [];
    await this.backend.getDiagnose().subscribe((data: any) => {
      for(let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });
  }

  async ionViewDidLeave() {

  }


  selectItem(item) {
    if(!this.selectedItems.includes(item)) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
    }
    console.log(this.selectedItems);
  }

  async add() {
    const selectedPatientId = await this.dataService.get(PATIENT_KEY);
    console.log('patientId: ' + selectedPatientId);
    if (this.selectedItems.length < 1) {
      const alert = await this.alertController.create({
        header: 'Auswahl',
        message: 'Bitte wählen Diagnosen aus!',
        buttons: ['OK'],
      });
      await alert.present();
    }
    const loading = await this.loadingController.create();
    await loading.present();
     // const diagnoses = JSON.stringify(this.selectedItems);
    this.backend.postDiagnoses(this.selectedItems, selectedPatientId).subscribe(async res => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Diagnosen hinzugefügt',
          message: 'Bitte wählen Sie nun die Pflegediagnosen aus um Pflegeempfehlungen anzuzeigen',
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigateByUrl('/menu/core-functions/core-functions/diagnoses', {replaceUrl: true});
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Erstellen fehlgeschlagen',
          //message: res.error.error,
          message: 'Überprüfen Sie Eingabedaten und Internetverbindung',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

  backButton() {
    this.router.navigateByUrl('/menu/core-functions/core-functions/diagnoses', {replaceUrl: true});
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }


}
