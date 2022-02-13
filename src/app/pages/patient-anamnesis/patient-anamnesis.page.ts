import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';
import {DataService, PATIENT_ITEM} from '../../service/data.service';
import {BackendDataService} from '../../service/backend-data.service';

@Component({
  selector: 'app-patient-anamnesis',
  templateUrl: './patient-anamnesis.page.html',
  styleUrls: ['./patient-anamnesis.page.scss'],
})
export class PatientAnamnesisPage implements OnInit {
  patientItem: any;
  anamnesis: any[];
  anamnesisCategories: Set<string> = new Set<string>();

  constructor(private authService: AuthenticationService, private router: Router,
              private dataService: DataService,
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

  ionViewWillEnter() {
    this.dataService.getData(PATIENT_ITEM).subscribe(result => {
      this.patientItem = result;
    }, error => {
      console.log('get patientItem failed' + error);
    });
    this.backendDataService.getAnamnesis();
  }


  backButton() {
    this.router.navigateByUrl('menu/care/patient-dashboard', {replaceUrl: true});
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }
}
