import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {UserDetails} from '../../helpers/userDetails';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  selectedPath = '';
  pages = [];

  constructor(private router: Router, private authService: AuthenticationService) {
    this.router.events.subscribe((event: RouterEvent) => {
      if(event && event.url) {
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(UserDetails.roles == 'ROLE_MODERATOR') { //=== doesnt work,typeconversion(==) required -- why?
      this.pages = [
        { title: 'core-functions', url: '/menu/core-functions' },
        { title: 'moderator', url: '/menu/moderator'},
        { path: 'profile', url: '/menu/profile'}
      ];
    } else {
      this.pages = [
        { title: 'core-functions', url: '/menu/core-functions' },
        { path: 'profile', url: '/menu/profile'}
      ];
    }
  }

  async logout() {
    await this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
  }
}
