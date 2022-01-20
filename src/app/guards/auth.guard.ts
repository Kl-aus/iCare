import { Injectable } from '@angular/core';
import {CanLoad, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../service/authentication.service';
import {filter, map, take} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private router: Router, private authService: AuthenticationService) {
  }

  canLoad(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
        console.log('GUARD:' + isAuthenticated);
        return true;
      } else {
        this.router.navigateByUrl('/login');
        return false;
      }
    })
    );
  }
}
