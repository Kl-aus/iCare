import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {BackendDataService} from '../../service/backend-data.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.page.html',
  styleUrls: ['./recommendations.page.scss'],
})

export class RecommendationsPage implements OnInit {
  diagnose = [];
  items = [];
  showContent = false;
  navigation: any;

  constructor(private route: ActivatedRoute, private router: Router, private backend: BackendDataService) {
    this.route.queryParams.subscribe(params => { //only used for subscribing to params -> detect changes
      // if (params && params.diagnose) { //for navigateByUrl
      //   this.diagnose = JSON.parse(params.diagnose);
      // }
      if (this.router.getCurrentNavigation().extras.state) {
        this.diagnose = this.router.getCurrentNavigation().extras.state.diagnose;
        this.showContent = true;
      } else  {
        this.diagnose = null;
      }
    });
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    console.log('diagnose array on enter REC PAGE (from trans parameters): '+ JSON.stringify(this.diagnose));
    await this.backend.getRecommendations(this.diagnose).subscribe((data: any) => {
      for(let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });
    // console.log('rec items array on enter: ' + JSON.stringify(this.items));
  }

  selectItem(item: any) {

  }

  ionViewWillLeave() {
    this.diagnose = [];
    this.items = [];
    this.showContent = false;
    // console.log('items array on leave: ' + JSON.stringify(this.items));
    // console.log('diagnoses array on leave: ' + JSON.stringify(this.diagnose));
  }
}
