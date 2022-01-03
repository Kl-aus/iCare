import { Component, OnInit } from '@angular/core';
import {BackendDataService} from '../../service/backend-data.service';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.page.html',
  styleUrls: ['./moderator.page.scss'],
})
export class ModeratorPage implements OnInit {

  constructor(private backend: BackendDataService, private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  test() {
    this.backend.setTest().subscribe((data: any) => {
     console.log('DATA: ' + data);
    }, error => {
      console.log(error);
    });
  }

  logout() {
      this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
    }
}
