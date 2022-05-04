import {Component, OnInit, ViewChild} from '@angular/core';
import  {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, IonDatetime, LoadingController} from '@ionic/angular';
import {BackendDataService} from '../../service/backend-data.service';
import {Router} from '@angular/router';
import { format, parseISO } from 'date-fns';
import {AuthenticationService} from "../../service/authentication.service";

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
              private backendDataService: BackendDataService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private authService: AuthenticationService,
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
    this.backendDataService.postPatient(this.patientDetailsForm.value);
    this.backendDataService.getPatients();
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
    this.router.navigateByUrl('menu/care/patient-dashboard', {replaceUrl: true});
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }
}
