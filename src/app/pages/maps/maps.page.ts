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
  markers: any=[];

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
    for(let marker of markers) {
      let position = new google.maps.LatLng(marker.latitude, marker.longitude);
      let mapMarker = new  google.maps.marker({
        position: position,
        title: marker.title,
        latitude: marker.latitude,
        longtitude: marker.longitude
      });

      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
    }
  }

  private addInfoWindowToMarker(mapMarker: any) {
    let infoWindowContent = '<div id="content">' + '<h2 id="firstHeading" class=firstHeading"></h2>' +
                              '<p>Lat: ' + mapMarker.latitude + '</div>' +
                                '</div>';
    let infoWindow = new google.maps.infoWindow({
      content: infoWindowContent
    });

    mapMarker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, mapMarker);
    });
    this.infoWindows.push(infoWindow);
  }
}
