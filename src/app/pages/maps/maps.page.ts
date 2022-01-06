import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  map: any;
  infoWindows: any = [];
  markers: any;

  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  constructor() { }

  ngOnInit() {
  }


  showMap() {
    const location = new google.maps.LatLng(48.2394808451526, 16.377114982086727);
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    console.log('Location var: ' + JSON.stringify(location));
  }

  ionViewDidEnter() {
    this.showMap();
  }

  getMapData() {
  }

  addMarkerToMap(markers) {

  }
  addInfoWindow(mapMarker: google.maps.Marker) {

  }

}
