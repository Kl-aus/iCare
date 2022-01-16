import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {DataGvAtService} from '../../service/data-gv-at.service';
import { Papa } from 'ngx-papaparse';
import {LoadingController} from '@ionic/angular';
import {Observable} from 'rxjs';

declare let google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  map: any;
  infoWindows: any[] = [];
  markers: any[] = [];

  csvData: any[] = [];
  headerRow: unknown = [];

  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  constructor(private dataGvAt: DataGvAtService, private papa: Papa, private loadingController: LoadingController) {
    this.dataGvAt.mapsObservable.subscribe((data: any) => {
      this.extractData(data);
      this.showMap();
    });
  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'lade ...',
    });
    await loading.present();
    this.getMapData();
    await loading.dismiss();
  }

  ionViewDidEnter() {
  }

  closeAllInfoWindows() {
    for (const window of this.infoWindows) {
      window.close();
    }
  }

  private addInfoWindowtoMarker(marker) {
    const infoWindowContent = '<div id="iw-content" >' + '<h2 id="iw-title">' + marker.title + '</h2>'
      + '<p class="iw.text">'+ '<b> Adresse: </b> ' + marker.address + '\n\r' + '</p>'
      + '<p class="iw.text">'+ '<b> Bezirk: </b> ' + marker.dist + '\n\r' + '</p>'
      + '<p class="iw.text">' + '<b> Telefon: </b> ' + marker.tel + '</p>'
      + '<ion-button id="navigate"> <p>navigieren</p> </ion-button>'
      + '</div>';

    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
    });

    google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
      document.getElementById('navigate').addEventListener('click', () => {
        window.open('https://www.google.com/maps/dir/?api=1&origin=My+Location&destination='+ marker.lat + ',' + marker.lng+'&travelmode=driving' );
      });
    });

    this.infoWindows.push(infoWindow);
  }

  private addMarkerToMap(markers) {
    for (let i = 0; i < markers.length -1; i++) {
      console.log('markerlength:' + markers.length);
      const tempString = markers[i][2].split(' ');
      const position = new google.maps.LatLng(tempString[2].replace(/[^.\d]/g, ''), tempString[1].replace(/[^.\d]/g, ''));
      const mapMarker = new google.maps.Marker({
        position,
        title: markers[i][6],
        address: markers[i][5],
        dist: markers[i][4],
        tel: markers[i][8],
        lat: tempString[2].replace(/[^.\d]/g, ''),
        lng: tempString[1].replace(/[^.\d]/g, ''),
      });
      mapMarker.setMap(this.map);
      this.addInfoWindowtoMarker(mapMarker);
    }
  }

    private showMap() {
    const location = new google.maps.LatLng(48.2394808451526, 16.377114982086727); //FH
    const options = {
      center: location,
      zoom: 10,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.addMarkerToMap(this.csvData);
  }

  private getMapData() {
    this.dataGvAt.getAdviceCenters();
  }

  private extractData(data) { //ERROR TypeError: FileReader.readAsText: Argument 1 does not implement interface Blob. <-- seems to be a firefox problem
    const csvData = data || '';
      this.papa.parse(csvData, {
      complete: parsedData => {
        this.headerRow = parsedData.data.splice(0,1)[0];
        this.csvData = parsedData.data;
      }
    });
  }
}
