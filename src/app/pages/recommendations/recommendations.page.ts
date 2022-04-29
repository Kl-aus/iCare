import {AfterContentChecked, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BackendDataService} from '../../service/backend-data.service';
import {SwiperComponent} from 'swiper/angular';
import Swiper, {SwiperOptions, Pagination} from 'swiper';
import {AlertController, LoadingController} from '@ionic/angular';
import {NursingMeasureModel} from '../../models/nursingMeasureModel';
import {DataService, PATIENT_KEY} from '../../service/data.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.page.html',
  styleUrls: ['./recommendations.page.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class RecommendationsPage implements AfterContentChecked, OnInit {
  @ViewChild('swiper') swiper: SwiperComponent;
  items = [];
  //items: NursingMeasureModel[] = [];
  images = [];
  navigation: any;
  searchTerm: string;
  hideContent = false;
  message = '';
  photo: any;
  selectedPatientId = 0;
  measureCategory: Set<string> = new Set<string>();


  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    pagination: true,
  };

  constructor(private route: ActivatedRoute, private router: Router,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private dataService: DataService,
              private backendDataService: BackendDataService) {
    this.backendDataService.recommendationsObservable.subscribe((data: any) => {
      this.items = data;
      for (const datum of this.items) {
        if(datum.nursingMeasureCategory.includes(',')) {
          datum.nursingMeasureCategory = 'Kombinationsdiagnose';
        } else if(!datum.nursingMeasureCategory){
          datum.nursingMeasureCategory = 'ohne Kategorie';
        }
        this.measureCategory.add(datum.nursingMeasureCategory);
      }

      if(this.items.length > 0) {
        this.hideContent = false;
        this.message = '';
      } else {
        this.hideContent = true;
        this.message = 'Bitte wähle eine oder mehrere Diagnose im "Diagnosen" Tab aus und wählen Sie "Zeige Empfehlung" aus dem Menü aus!';
      }
      this.loadImages().then(_=> console.log('images loaded'));
    });
  }

  ngOnInit(): void {
        Swiper.use([Pagination]);
        //this.backendDataService.getImages('asd');
    }

  async ionViewDidEnter() {
    this.dataService.getData(PATIENT_KEY).subscribe(result => {
      this.selectedPatientId = result;
      this.backendDataService.getRecommendations(this.selectedPatientId);
    }, error => {
      console.log('get patientId failed ' + error);
    });
  }

  async blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  async loadImages() {
    const loading = await this.loadingController.create({
      message: 'Bilder werden geladen...',
    });
    await loading.present();
    for (const item of this.items) {
      for (const image of item.images) {
        this.backendDataService.getImages(image.imageName).subscribe((data: any) => {
          this.blobToBase64(data).then((res: any) => {
            image.data = res;
          });
        });
      }
    }
    await loading.dismiss();
  }

  ionViewWillLeave() {
    this.items = [];
    this.message = '';
    this.hideContent = true;
  }

  //swiper not implemented right -- update swiper for "snapping behaviour"
  ngAfterContentChecked(): void {
        if (this.swiper) { //check if swiper is defined
          this.swiper.updateSwiper({});
        }
    }

  selectItem(item: any) {
  }
}
