import { Injectable } from '@angular/core';
import {CanLoad, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../service/authentication.service';
import {filter, map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canLoad(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          console.log('autoLoginGUARD: is auth '+ isAuthenticated);
          this.router.navigateByUrl('/menu/core-functions/core-functions/patients', {replaceUrl: true});
        } else {
          console.log('autoLoginGUARD: is auth '+ isAuthenticated);
          return true;
        }
      })
    );
  }
}
