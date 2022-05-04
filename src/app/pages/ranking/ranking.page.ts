import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {SwiperOptions} from 'swiper';
import {BackendDataService} from '../../service/backend-data.service';
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
  recommendations = [];
  measure: any;
  diagnose: any;

  config: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 30,
    centeredSlides: true,
  };
  constructor(    private route: ActivatedRoute,
                  private router: Router,
                  private backendDataService: BackendDataService,
                  private authService: AuthenticationService,
                  private popoverCtrl: PopoverController) {
    this.backendDataService.recommendationsObservable.subscribe((data: any) => {
      this.recommendations = data;
    });
  }

  ngOnInit() {
  }

  async notifications(ev: any) {
    const popover = await this.popoverCtrl.create({
      event: ev,
      component: undefined,
      componentProps: undefined,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

  ionViewDidEnter() {
    this.backendDataService.getAllRecommendations();
  }

  backButton() {
    this.router.navigateByUrl('menu/care/patient-dashboard', {replaceUrl: true});
  }

  logout() {
    this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }

}
