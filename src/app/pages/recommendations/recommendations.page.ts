import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {BackendDataService} from '../../service/backend-data.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.page.html',
  styleUrls: ['./recommendations.page.scss'],
})

export class RecommendationsPage implements OnInit {
  diagnose: any[];
  items: any[];
  showContent = false;
  navigation: any;

  constructor(private route: ActivatedRoute, private router: Router, private backend: BackendDataService) {
    this.navigation = this.router.getCurrentNavigation();
    // if (this.router.getCurrentNavigation().extras.state) {
    //   this.diagnose = this.router.getCurrentNavigation().extras.state.diagnose;
    //   this.showContent = true;
    // } else  {
    //   this.diagnose = null;
    // }
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.navigation.extras.state) {
      this.diagnose = this.navigation.extras.state.diagnose;
      this.showContent = true;
    } else  {
      this.diagnose = null;
    }

    this.backend.getRecommendations(this.diagnose).subscribe((data: any) => {
      for(let i = 0; i < data.length; i++) {
        this.items.push(data[i]);
        this.items = [...this.items]; //Clone Array for updating Viewport
      }
    }, error => {
      console.log(error);
    });
  }

  selectItem(item: any) {

  }

  ionViewWillLeave() {
    this.diagnose = [];
    this.items = [];
    this.showContent = false;
  }
}
