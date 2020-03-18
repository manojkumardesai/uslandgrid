import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  public map;
  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 4
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 4,
      maxZoom: 20,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    const cultureLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/tx_plss/wms?', {
       layers: 'Culture',
       format: 'image/png8',
       transparent: true,
       styles: '',
       attribution: null
     }).addTo(this.map);

    const plssLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/tx_plss/wms?', {
       layers: 'National_PLSS',
       format: 'image/png8',
       transparent: true,
       styles: '',
       attribution: null
     }).addTo(this.map);

     const wellsLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/Wells/wms?', {
       layers: 'OK_Wells',
       format: 'image/png8',
       transparent: true,
       styles: '',
       attribution: null
     }).addTo(this.map);
  }

}
