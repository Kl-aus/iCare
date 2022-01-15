import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {BackendDataService} from '../../service/backend-data.service';
import {DataService} from '../../service/data.service';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';
import {Storage} from '@capacitor/storage';

const PATIENT_KEY = 'patientId';

@Component({
  selector: 'app-choose-diagnose',
  templateUrl: './choose-diagnose.page.html',
  styleUrls: ['./choose-diagnose.page.scss'],
})
export class ChooseDiagnosePage implements OnInit {
  searchTerm: string;
  items = [];
  selectedItems = [];
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;


  constructor(private backendDataService: BackendDataService,
              private dataService: DataService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private authService: AuthenticationService,
              private router: Router) {
    this.backendDataService.diagnosesObservable.subscribe((data: any[]) => {
      this.items = data;
    });
  }

  ngOnInit() {
    this.backendDataService.getDiagnose();
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
    const selectedPatientId = await Storage.get({key: PATIENT_KEY});
    if (this.selectedItems.length < 1) {
      const alert = await this.alertController.create({
        header: 'Auswahl',
        message: 'Bitte wählen Diagnosen aus!',
        buttons: ['OK'],
      });
      await alert.present();
    }
    await this.backendDataService.postDiagnoses(this.selectedItems, selectedPatientId.value);
  }

  backButton() {
    this.router.navigateByUrl('/menu/core-functions/core-functions/diagnoses', {replaceUrl: true});
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }


}
