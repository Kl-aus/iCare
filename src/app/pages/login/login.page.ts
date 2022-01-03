import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import {Data, Router} from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  private storageString: string;

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.credentials = this.fb.group({
        //email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]] //TODO: Span Text wird nicht angezeigt
    });
  }

  async login() {
      const loading = await this.loadingController.create();
      await loading.present();
      this.authService.login(this.credentials.value).subscribe(
        async (res) => {
          await loading.dismiss();
          await this.router.navigateByUrl('/menu/core-functions', {replaceUrl: true});
        },
        async (res) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Login fehlgeschlagen',
            //message: res.error.error,
            message: 'Benutzername oder Passwort nicht gültig!',
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

  async goto() {
    await this.router.navigateByUrl('/register', {replaceUrl: true});
  }
}


