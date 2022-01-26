import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {DataService} from '../service/data.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private alertController: AlertController,
              private dataService: DataService,
              private router: Router) {

  }

  canActivate(): boolean {
    if (this.dataService.userDetailsModel.roles[0] == 'ROLE_MODERATOR') { //TODO
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
      message: 'Dieser Bereich ist nur Moderatoren zugänglich',
      buttons: ['OK']
    });
    await alert.present();
  }
}
