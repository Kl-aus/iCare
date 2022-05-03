import {Component, OnInit} from '@angular/core';
import {BackendDataService} from '../../service/backend-data.service';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RecommendationModel} from '../../models/recommendationModel';
import {DiagnoseModel} from '../../models/diagnoseModel';
import {NursingMeasureModel} from '../../models/nursingMeasureModel';
import {AlertController, LoadingController, Platform} from '@ionic/angular';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {Images} from '../../models/images';

const IMAGE_DIR = 'stored-images';

@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.page.html',
  styleUrls: ['./moderator.page.scss'],
})

export class ModeratorPage implements OnInit {
  author: FormGroup;
  diagnoseData: FormGroup;
  recommendationsData: FormGroup;

  searchTerm: string;
  searchTermMeasure: string;
  selectedDiagnose: any;
  selectedMeasure: any;
  diagnoses = [];
  measures = [];
  measure: NursingMeasureModel;
  images: Images[] = [];
  diagnose:  DiagnoseModel;
  authorInfo: RecommendationModel;
  subSegmentType = 'choose';
  segmentType = 'author';
  authorSegment = false;
  diagnoseSegment = true;
  measureSegment = true;
  lastSegment = true;
  hideContent = false;
  message = '';
  //images: LocalFile[] = [];
  category = 'Trinken';

  constructor(private platform: Platform,
              private backendDataService: BackendDataService,
              private authService: AuthenticationService,
              private fb: FormBuilder,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private router: Router) {
    this.backendDataService.diagnosesObservable.subscribe((data: any[]) => {
      this.diagnoses = [];
      this.diagnoses = data;
    }, error => {
      console.log(error);
    });
    this.backendDataService.measureObservable.subscribe((data: any[]) => {
      this.measures = [];
      this.measures = data;
      if(this.measures.length > 0) {
        this.hideContent = false;
        this.message = '';
      } else {
        this.hideContent = true;
        this.message = 'Fehler beim laden der Maßnahmen, überprüfen Sie bitte Ihre Internetverbindung!';
      }
    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.backendDataService.getMeasures();
    console.log('MASS NAMEN: ' + this.measures);
    this.backendDataService.getDiagnose();
    this.loadFiles();
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

  ionViewDidLeave() {
    this.measures = [];
    this.diagnoses = [];
    this.diagnoseSegment = true;
    this.measureSegment = true;
    this.lastSegment = true;
    this.message = '';
  }

  submitInfoForm() {
    this.authorInfo = new RecommendationModel(this.author.value.name, this.author.value.literatureSources);
    this.diagnoseSegment = false;
    this.segmentType = 'diagnose';
  }

  submitDiagnoseForm() {
    this.diagnose = new DiagnoseModel(this.diagnoseData.value.diagnoseTitle, this.diagnoseData.value.diagnoseDescription, this.category, 0);
    this.measureSegment = false;
    this.segmentType = 'measure';
  }

  submitRecommendationForm() {
    this.measure = new NursingMeasureModel(this.recommendationsData.value.recommendationTitle,
                                            this.recommendationsData.value.recommendationDescription, this.category, 0);
    this.lastSegment = false;
    this.segmentType = 'save';
  }

  async saveRecommendation() {
    await this.backendDataService.saveRecommendation(this.authorInfo, this.diagnose, this.measure);
    const loading = await this.loadingController.create({
      message: 'Bilder werden in die "Cloud" hochgeladen...',
    });

    await loading.present();
    setTimeout(async () => {
      for (const item of this.images) {
        const formData = new FormData();
        const response = await fetch(item.data);
        const blob = await response.blob();
        formData.append('file', blob, item.imageName);
        formData.append('title', this.recommendationsData.value.recommendationDescription);
        await this.backendDataService.saveImages(formData);
      }
    }, 1500);
    await loading.dismiss();
  }

  selectDiagnoseItem(item) {
    this.diagnose = new DiagnoseModel(item.nursingDiagnoses, item.nursingDiagnosesDescription,
                                      item.nursingDiagnosesCategory, item.diagnosesId);
    this.selectedDiagnose = item;
    this.measureSegment = false;
    this.segmentType = 'measure';
  }

  selectMeasureItem(item) {
    this.selectedMeasure = item;
    this.measure = new NursingMeasureModel(item.careRecommendation,
      item.careRecommendationTitle, item.nursingMeasureCategory, item.recommendationId);
    this.lastSegment = false;
    this.segmentType = 'save';
  }

  async selectImage() {
    if(this.platform.is('android') || this.platform.is('ios')) {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      if (image) {
        await this.saveImage(image);
      }
    } else {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });
      if (image) {
        await this.saveImage(image);
      }
    }
  }

  async loadFiles() {
    this.images = [];
    const loading = await this.loadingController.create({
      message: 'lade Bilder...',
    });
    await loading.present;
    Filesystem.readdir({
      path: IMAGE_DIR,
      directory: Directory.Data,
    }).then(res => {
      this.loadFileData(res.files);
    }, async error => {
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      });
    }).then(_=> {
      loading.dismiss();
    });
  }

  async loadFileData(filenames: string[]) {
    for (const f of filenames) {
      const filePath = `${IMAGE_DIR}/${f}`;
      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });
      this.images.push({
        imageId: 1,
        imageName: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      });
    }
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    const fileName = new Date().getTime()+ '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
    });
    await this.loadFiles();
  }

  async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path
      });
      return file.data;
    } else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  // async startUpload(file: Images) {
  //   const response = await fetch(file.data);
  //   const blob = await response.blob();
  //   const formData = new FormData();
  //   formData.append('file', blob, file.imageName);
  //   await this.uploadData(formData);
  // }
  //
  // async uploadData(formData: FormData) {
  //   const loading = await this.loadingController.create({
  //     message: 'Bilder werden in die "Cloud" hochgeladen...',
  //   });
  //   await loading.present();
  //   //post request here
  //   await loading.dismiss();
  // }

  async deleteImage(file: Images) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.path
    });
    await this.loadFiles();
  }

  logout() {
      this.authService.logout().then(r => this.router.navigateByUrl('/login', {replaceUrl: true}));
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
