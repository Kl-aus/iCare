import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-patient-anamnesis',
  templateUrl: './patient-anamnesis.page.html',
  styleUrls: ['./patient-anamnesis.page.scss'],
})
export class PatientAnamnesisPage implements OnInit {

  constructor( private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  backButton() {
    this.router.navigateByUrl('menu/care/patient-dashboard', {replaceUrl: true});
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }

}
