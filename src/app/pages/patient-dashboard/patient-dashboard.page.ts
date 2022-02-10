import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DataService, PATIENT_ITEM} from '../../service/data.service';
import {AlertController} from '@ionic/angular';
import {AuthenticationService} from '../../service/authentication.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.page.html',
  styleUrls: ['./patient-dashboard.page.scss'],
})
export class PatientDashboardPage implements OnInit {
  patientItem: any;


  constructor( private router: Router,
               private dataService: DataService,
               private authService: AuthenticationService,
               private alertController: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.dataService.getData(PATIENT_ITEM).subscribe(async result => {
      this.patientItem = result;
      if (result == null) {
        const alert = await this.alertController.create({
          header: 'Fehler',
          message: 'Bitte wählen sie zuerst einen Patient aus',
          buttons: ['OK'],
        });
        await alert.present();
        await this.router.navigateByUrl('/menu/care/patients', {replaceUrl: true});
      }
    }, error => {
      this.router.navigateByUrl('/menu/care/patients', {replaceUrl: true});
      console.log('get patientItem failed ' + error);
    });
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }

  goTo(target: string) {
    this.router.navigateByUrl('/menu/care/'+target, {replaceUrl: true});

  }
}
