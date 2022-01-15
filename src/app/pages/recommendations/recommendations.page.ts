import {AfterContentChecked, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BackendDataService} from '../../service/backend-data.service';
import {SwiperComponent} from 'swiper/angular';
import Swiper, {SwiperOptions, Pagination} from 'swiper';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.page.html',
  styleUrls: ['./recommendations.page.scss'],
  //encapsulation: ViewEncapsulation.None //for swiper(center): no angular standard css classes (should be used in a component)
})

export class RecommendationsPage implements AfterContentChecked, OnInit {
  diagnose = [];
  items = [];
  images = [];
  navigation: any;
  searchTerm: string;
  hideContent = true;
  message = '';
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    pagination: true,
  };

  @ViewChild('swiper') swiper: SwiperComponent;

  constructor(private route: ActivatedRoute, private router: Router, private backendDataService: BackendDataService) {
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
      if(this.items.length > 0) {
        this.hideContent = false;
        this.message = '';
      } else {
        this.hideContent = true;
        this.message = 'Bitte wählen Sie eine oder mehrere Diagnose im "Diagnosen" Tab aus und wählen Sie "Zeige Empfehlung" aus dem Menü aus!';
      }
    });
  }

  ngOnInit(): void {
        Swiper.use([Pagination]);
    }

  //swiper not implemented right -- update swiper for "snapping behaviour"
  ngAfterContentChecked(): void {
        if (this.swiper) { //check if swiper is defined
          this.swiper.updateSwiper({});
        }
    }

  async ionViewWillEnter() {
    await this.backendDataService.getRecommendations(this.diagnose);
  }

  ionViewWillLeave() {
    this.diagnose = [];
    this.items = [];
    this.message = '';
    this.hideContent = true;
  }

  selectItem(item: any) {
  }

}
