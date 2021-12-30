import {Component, OnInit, ViewChild} from '@angular/core';
import {BackendDataService} from '../../service/backend-data.service';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {ToastController} from '@ionic/angular';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';
import {DataService} from '../../service/data.service';

const DIAGNOSES_KEY = 'diagnoses';

@Component({
  selector: 'app-diagnoses',
  templateUrl: './diagnoses.page.html',
  styleUrls: ['./diagnoses.page.scss'],
})

export class DiagnosesPage implements OnInit {
  searchTerm: string;
  // TODO Respone Klasse
  items = [];
  selectedItems = [];

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;


  constructor(private backend: BackendDataService,
              private dataService: DataService,
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

  async ionViewDidEnter() {
    this.items = []; //clear list to avoid duplicated entries
    await this.backend.getDiagnose().subscribe((data: any) => {
      for(let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });

    const diagnoses = await this.dataService.get(DIAGNOSES_KEY);
    console.log('DIAG: ', diagnoses);
    //this.selectedItems = diagnoses; //does not work
    for(let i = 0; i < diagnoses.length; i++) {
      if(this.selectedItems.includes(diagnoses[i])) {
        this.selectedItems.push(diagnoses[i]);
      } else {
        this.selectedItems.splice(this.selectedItems.indexOf(diagnoses[i].diagnosesId), 1);
      }
    }
  }

  async ionViewDidLeave() {
     await this.dataService.remove(DIAGNOSES_KEY)
       .then(r => {
         console.log('reset diagnoses');
       }).catch(error => {
         alert('error while loading diagnoses: '+ error);
       });
    console.log('array Diagnoses: ', this.selectedItems);
    await this.dataService.save(DIAGNOSES_KEY, this.selectedItems)
      .then(r => {
        console.log('diagnoses saved');
      }).catch(error => {
        alert('error while saving diagnoses: '+ error);
      });
    this.selectedItems = [];
  }


  selectItem(item) {

    if(!this.selectedItems.includes(item)) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
    }
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }
}
