import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {IonSlides} from '@ionic/angular';
import {DataService, INTRO_KEY} from '../../service/data.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
  }

  next() {
    this.slides.slideNext();
  }

  async start() {
    this.dataService.saveData(INTRO_KEY, 'true').subscribe(result => {
      console.log(result);
    }, error => {
      console.log('error saving intro key: ' + error);
    });
    await this.router.navigateByUrl(`/login`, {replaceUrl: true});
  }
}
