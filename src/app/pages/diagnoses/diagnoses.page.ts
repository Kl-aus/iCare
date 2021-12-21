import {Component, OnInit, ViewChild} from '@angular/core';
import {BackendDataService} from '../../service/backend-data.service';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import { ToastController } from '@ionic/angular';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-diagnoses',
  templateUrl: './diagnoses.page.html',
  styleUrls: ['./diagnoses.page.scss'],
})

export class DiagnosesPage implements OnInit {
  searchTerm: string;
  scrollTo: number = null;
  // TODO Respone Klasse
  items = [];

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(private backend: BackendDataService,
              private toastCtrl: ToastController,
              private authService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    this.backend.getDiagnose().subscribe((data: any) => {
      for(let i = 0; i < data.length; i++) {
          this.items.push(data[i]);
          this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });
  }

  ionViewWillEnter(){
    this.items = []; //clear list to avoid duplicated entries
    this.backend.getDiagnose().subscribe((data: any) => {
      for(let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });
  }

 async selectItem(item) {
    const toast = await this.toastCtrl.create({
      message: item,
      duration: 2000
    });
    await toast.present();
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }
}
