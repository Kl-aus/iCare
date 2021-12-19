import { Component, OnInit } from '@angular/core';
import  {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {BackendDataService} from '../../service/backend-data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.page.html',
  styleUrls: ['./patient-details.page.scss'],
})

export class PatientDetailsPage implements OnInit {
  public patientDetailsForm: FormGroup;
  //public patient: PatientModel;


  constructor(public formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              private backend: BackendDataService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private router: Router) {  }

  ngOnInit() {
    this.patientDetailsForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      height: ['', [Validators.required]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    });
  }

 async addPatientToDb() {

   const loading = await this.loadingController.create();
   await loading.present();

    this.backend.postPatient(this.patientDetailsForm.value).subscribe(async res => {
          await loading.dismiss();
          const alert = await this.alertController.create({
          header: 'Patient erstellt',
          //message: res.error.error,
          message: 'Bitte wählen Sie nun zuerst den Patient und dann die Pflegediagnosen aus',
          buttons: ['OK'],
        });
        await alert.present();
        await this.router.navigateByUrl('/menu/patients', {replaceUrl: true});
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
}
