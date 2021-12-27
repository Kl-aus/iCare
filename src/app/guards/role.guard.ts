import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UserDetails} from '../helpers/userDetails';
import {AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private alertController: AlertController, private router: Router) {

  }

  canActivate(): boolean {
    if (UserDetails.roles == 'ROLE_MODERATOR') { //Lint: === doesnt work,typeconversion(==) required -- why?
      return true;
    } else {
      this.presentAlert(); //TODO: returned promise ?
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Zugriff gesperrt',
      message: 'Dieser Bereich ist nur Moderatoren zugänglich' + UserDetails.roles,
      buttons: ['OK']
    });
    await alert.present();
  }
}
