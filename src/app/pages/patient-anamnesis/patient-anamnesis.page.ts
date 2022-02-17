import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';
import {DataService, PATIENT_ITEM} from '../../service/data.service';
import {BackendDataService} from '../../service/backend-data.service';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-patient-anamnesis',
  templateUrl: './patient-anamnesis.page.html',
  styleUrls: ['./patient-anamnesis.page.scss'],
})
export class PatientAnamnesisPage implements OnInit {
  patientItem: any;
  anamnesis: any[];
  anamnesisCategories: Set<string> = new Set<string>();
  anamnesisQuestions: string[];

  constructor(private authService: AuthenticationService, private router: Router,
              private dataService: DataService,
              private alertController: AlertController,
              private backendDataService: BackendDataService) {
    this.backendDataService.anamenesisObservable.subscribe((data: any[]) => {
      this.anamnesis = data;
      for (const datum of this.anamnesis) {
          this.anamnesisCategories.add(datum.anamnesisCategory);
      }
    }, error => {
      console.log('cannot load anamnese');
    });
  }

  ngOnInit() {
  }

  addQuestion(question) {
    if(!this.anamnesisQuestions.includes(question)) {
      this.anamnesisQuestions.push(question);
    } else {
      this.anamnesisQuestions.splice(this.anamnesisQuestions.indexOf(question), 1);
    }
  }

  async save() {
    this.dataService.getData(PATIENT_ITEM).subscribe(result => {
      this.patientItem = result;
    }, error => {
      console.log('get patientItem failed' + error);
    });
    this.backendDataService.saveAnamnesis(this.anamnesisQuestions, this.patientItem.patientId);
    const alert = await this.alertController.create({
      header: 'Anamnese',
      message: 'Die Anamnese wurde gespeichert!',
      buttons: ['OK'],
    });
    await alert.present();
    this.router.navigateByUrl('menu/care/patient-dashboard', {replaceUrl: true});
  }

  ionViewDidEnter() {
    this.anamnesisQuestions = [];
    this.dataService.getData(PATIENT_ITEM).subscribe(result => {
      this.patientItem = result;
    }, error => {
      console.log('get patientItem failed' + error);
    });
    this.backendDataService.getAnamnesis();
  }

  ionViewDidLeave() {
    this.anamnesisQuestions = [];
  }

  backButton() {
    this.router.navigateByUrl('menu/care/patient-dashboard', {replaceUrl: true});
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }

}
