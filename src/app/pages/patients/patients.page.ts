import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {BackendDataService} from '../../service/backend-data.service';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})
export class PatientsPage implements OnInit {
  items = [];
  searchTerm: string;

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(private backend: BackendDataService, private toastCtrl: ToastController, private router: Router) {
  }

  ngOnInit() {
    this.backend.getDiagnose().subscribe((data: any) => {
      for(let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
        //this.items = this.items;
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

  addPatient() {
    this.router.navigateByUrl('/patient-details');
  }
}
