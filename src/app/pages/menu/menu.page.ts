import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  selectedPath = '';
  pages = [];

  constructor(private router: Router,
              private dataService: DataService,
              private authService: AuthenticationService) {
    this.router.events.subscribe((event: RouterEvent) => {
      if(event && event.url) {
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(this.dataService.userDetailsModel.roles[0] == 'ROLE_MODERATOR') {
      this.pages = [
        { title: 'pflege', url: '/menu/care' },
        { title: 'moderator', url: '/menu/moderator'},
        { title: 'maps', url: '/menu/maps' },
        { title: 'ranking', url: '/menu/ranking' },
      ];
    } else {
      this.pages = [
        { title: 'pflege', url: '/menu/care' },
        { title: 'maps', url: '/menu/maps' },
        // { title: 'profile', url: '/menu/profile'}
      ];
    }
  }

  async logout() {
    await this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }
}
