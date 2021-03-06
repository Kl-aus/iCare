import {Component, OnInit, ViewChild} from '@angular/core';
import  {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, IonDatetime, LoadingController} from '@ionic/angular';
import {BackendDataService} from '../../service/backend-data.service';
import {Router} from '@angular/router';
import { format, parseISO } from 'date-fns';
import {UserDetails} from '../../helpers/userDetails';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.page.html',
  styleUrls: ['./patient-details.page.scss'],
})

export class PatientDetailsPage implements OnInit {

  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;

  selectedGender: any;
  patientDetailsForm: FormGroup;
  dateValue: any;

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
  console.log('UserDetailsID: ' + UserDetails.id);
    this.backend.postPatient(this.patientDetailsForm.value).subscribe(async res => {
          await loading.dismiss();
          const alert = await this.alertController.create({
          header: 'Patient erstellt',
          //message: res.error.error,
          message: 'Bitte wählen Sie nun zuerst den Patient und dann die Pflegediagnosen aus',
          buttons: ['OK'],
        });
        await alert.present();
        await this.router.navigateByUrl('/menu/core-functions/core-functions/patients', {replaceUrl: true});
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

  get gender() {
    return this.patientDetailsForm.get('gender');
  }

  onChange() {
   this.patientDetailsForm.controls.gender.setValue(this.selectedGender);
  }

  formatDate(value: string) {
    return format(parseISO(value), 'MMM-dd-yyyy');
  }

  backButton() {
    this.router.navigateByUrl('/menu/core-functions/core-functions/patients', {replaceUrl: true});
  }
}
