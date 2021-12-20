import { Component, OnInit } from '@angular/core';
import  {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import {BackendDataService} from '../../service/backend-data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.page.html',
  styleUrls: ['./patient-details.page.scss'],
})

export class PatientDetailsPage implements OnInit {
  selectedGender: any;
  patientDetailsForm: FormGroup;

  constructor(public formBuilder: FormBuilder,
              private backend: BackendDataService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private router: Router) {  }

  ngOnInit() {
    this.patientDetailsForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      weight: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      height: ['', [Validators.required, Validators.pattern('[0-9]+')]],
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

  get firstName() {
    return this.patientDetailsForm.get('firstName');
  }

  get lastName() {
    return this.patientDetailsForm.get('lastName');
  }

  get weight() {
    return this.patientDetailsForm.get('weight');
  }

  get height() {
    return this.patientDetailsForm.get('height');
  }

  get age() {
    return this.patientDetailsForm.get('age');
  }


  onChange() {
   this.patientDetailsForm.controls.gender.setValue(this.selectedGender);
  }
}
