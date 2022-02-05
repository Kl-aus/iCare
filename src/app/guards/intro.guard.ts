import {Injectable} from '@angular/core';
import {CanLoad, Router} from '@angular/router';
import {DataService, INTRO_KEY} from '../service/data.service';


@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {

  constructor(private router: Router, private dataService: DataService) {
  }

  async canLoad(): Promise<boolean> {
    this.dataService.getData(INTRO_KEY).subscribe(result => {
      if (result === 'true') {
        return true;
      } else {
        this.router.navigateByUrl('/intro', {replaceUrl: true});
        return true;
      }
    }, error => {
      console.log('load intro Key failed: ' + error);
      this.router.navigateByUrl('/intro', {replaceUrl: true});
      return true;
    });
    return true;
  }
}
