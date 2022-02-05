import {AfterContentChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BackendDataService} from '../../service/backend-data.service';
import {SwiperComponent} from 'swiper/angular';
import Swiper, {SwiperOptions, Pagination} from 'swiper';
import {AlertController, LoadingController} from '@ionic/angular';
import {NursingMeasureModel} from '../../models/nursingMeasureModel';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.page.html',
  styleUrls: ['./recommendations.page.scss'],
})

export class RecommendationsPage implements AfterContentChecked, OnInit {
  @ViewChild('swiper') swiper: SwiperComponent;

  diagnose = [];
  //items = [];
  items: NursingMeasureModel[] = [];
  images = [];
  navigation: any;
  searchTerm: string;
  hideContent = true;
  message = '';
  photo: any;

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    pagination: true,
  };

  constructor(private route: ActivatedRoute, private router: Router,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private backendDataService: BackendDataService) {
    this.route.queryParams.subscribe(params => { //only used for subscribing to params -> detect changes
      // if (params && params.diagnose) { //for navigateByUrl
      //   this.diagnose = JSON.parse(params.diagnose);
      // }
      if (this.router.getCurrentNavigation().extras.state) {
        this.diagnose = this.router.getCurrentNavigation().extras.state.diagnose;
      } else  {
        this.diagnose = null;
      }
    });

    this.backendDataService.recommendationsObservable.subscribe((data: any) => {
      this.items  = data;
      console.log('DATA ARRAY: ' + JSON.stringify(data));
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
        this.backendDataService.getImages('asd');
    }

  async ionViewWillEnter() {
    await this.backendDataService.getRecommendations(this.diagnose);
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
    this.diagnose = [];
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
