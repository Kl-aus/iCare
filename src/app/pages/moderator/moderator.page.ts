import {Component, OnInit, ViewChild} from '@angular/core';
import {BackendDataService} from '../../service/backend-data.service';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RecommendationModel} from '../../models/recommendationModel';
import {DiagnoseModel} from '../../models/diagnoseModel';
import {NursingMeasureModel} from '../../models/nursingMeasureModel';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.page.html',
  styleUrls: ['./moderator.page.scss'],
})

export class ModeratorPage implements OnInit {
  author: FormGroup;
  diagnoseData: FormGroup;
  recommendationsData: FormGroup;

  nursingMeasures = [];
  segmentType = 'author';
  authorSegment = false;
  diagnoseSegment = true;
  measureSegment = true;
  lastSegment = true;
  diagnose:  DiagnoseModel;
  authorInfo: RecommendationModel;

  constructor(private backendDataService: BackendDataService,
              private authService: AuthenticationService,
              private fb: FormBuilder,
              private alertController: AlertController,
              private router: Router) { }

  ngOnInit() {
    this.author = this.fb.group({
      name: ['', [Validators.required]],
      literatureSources: ['', [Validators.required]],
    });

    this.diagnoseData = this.fb.group({
      diagnoseTitle: ['', [Validators.required]],
      diagnoseDescription: ['', [Validators.required]],
    });

    this.recommendationsData = this.fb.group({
      recommendationTitle: ['', [Validators.required]],
      recommendationDescription: ['', [Validators.required]],
    });
  }

  submitInfoForm() {
    this.authorInfo = new RecommendationModel(this.author.value.name, this.author.value.literatureSources);
    this.diagnoseSegment = false;
    // eslint-disable-next-line no-underscore-dangle
  }

  submitDiagnoseForm() {
    this.diagnose = new DiagnoseModel(this.diagnoseData.value.diagnoseTitle, this.diagnoseData.value.diagnoseDescription);
    this.measureSegment = false;
    console.log('DIAGNOSEN :' + JSON.stringify(this.diagnose));
  }

  async submitRecommendationForm() {
    const measure = new NursingMeasureModel(this.recommendationsData.value.recommendationTitle, this.recommendationsData.value.recommendationDescription);
    if (this.nursingMeasures.length < 9) {
      this.nursingMeasures.push(measure);
    } else {
      const alert = await this.alertController.create({
        header: 'Hinzufügen verweigert',
        message: 'Maximalanzahl an Maßnahmen erreicht',
        buttons: ['OK'],
      });
      await alert.present();
    }
    this.lastSegment = false;
  }

  saveRecommendation() {
    this.backendDataService.saveRecommendation(this.authorInfo, this.diagnose, this.nursingMeasures);
  }

  ionViewDidLeave() {
    this.nursingMeasures = [];
    this.diagnoseSegment = true;
    this.measureSegment = true;
    this.lastSegment = true;
  }

  logout() {
      this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
    }

  segmentChanged($event: any) {

  }

  get name() {
    return this.author.get('name');
  }

  get literatureSources() {
    return this.author.get('literatureSources');
  }

  get diagnoseTitle() {
    return this.diagnoseData.get('diagnoseTitle');
  }

  get diagnoseDescription() {
    return this.diagnoseData.get('diagnoseDescription');
  }

  get recommendationTitle() {
    return this.recommendationsData.get('recommendationTitle');
  }

  get recommendationDescription() {
    return this.recommendationsData.get('recommendationDescription');
  }
}
