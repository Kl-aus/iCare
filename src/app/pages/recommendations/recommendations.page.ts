import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {BackendDataService} from '../../service/backend-data.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.page.html',
  styleUrls: ['./recommendations.page.scss'],
})

export class RecommendationsPage {
  diagnose = [];
  items = [];
  navigation: any;
  hideContent = true;
  message = '';

  constructor(private route: ActivatedRoute, private router: Router, private backend: BackendDataService) {
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
  }

  async ionViewWillEnter() {
    console.log('diagnose array on enter REC PAGE (from trans parameters): '+ JSON.stringify(this.diagnose));
    await this.backend.getRecommendations(this.diagnose).subscribe((data: any) => {
      for(let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
        if(this.items.length > 0) {
          this.hideContent = false;
          this.message = '';
        } else {
          this.hideContent = true;
          this.message = 'Bitte wählen Sie eine oder mehrere Diagnose im "Diagnosen" Tab aus und wählen Sie "Zeige Empfehlung" aus dem Menü aus!';
        }
      }
    }, error => {
      this.hideContent = true;
      this.message = 'Bitte wählen Sie eine oder mehrere Diagnose im "Diagnosen" Tab aus und wählen Sie "Zeige Empfehlung" aus dem Menü aus!';
      console.log(error);
    });
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
