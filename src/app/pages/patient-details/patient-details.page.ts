import { Component, OnInit } from '@angular/core';
import  {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.page.html',
  styleUrls: ['./patient-details.page.scss'],
})

export class PatientDetailsPage implements OnInit {
  public patientDetailsForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private toastCtrl: ToastController) {
    this.patientDetailsForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      weight: ['', Validators.compose([Validators.required])],
      height: ['', Validators.compose([Validators.required])],
      age: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
  }

 async addPatientToDb() {

    //Todo Post mit Patientendaten
   const toast = await this.toastCtrl.create({
     message: 'Neuer Patient erstellt' + this.patientDetailsForm.value,
     duration: 2000
   });
   await toast.present();
  }
}
