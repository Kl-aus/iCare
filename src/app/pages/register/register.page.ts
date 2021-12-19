import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../service/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  credentials: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private router: Router) { }

  ngOnInit(): void {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]
      ]
    });
  }

  async onSubmit() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService.register(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Registrierung abgerschlossen',
          //message: res.error.error,
          message: 'Bitte mit Benutzername & Passwort einloggen',
          buttons: ['OK'],
        });
        await alert.present();
        await this.router.navigateByUrl('/login', {replaceUrl: true});
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Registrierung fehlgeschlagen',
          //message: res.error.error,
          message: 'Internetverbindung überprüfen und nochmals probieren',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }


  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  get username() {
    return this.credentials.get('username');
  }
}
