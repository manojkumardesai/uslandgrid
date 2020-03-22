import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  public map;
  public tiles;
  public cultureLayer;
  public plssLayer;
  public wellsLayer;
  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [35.420372, -98.512855],
      zoom: 8
    });
    
    this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 4,
      maxZoom: 20,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    this.tiles.addTo(this.map);

    this.cultureLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/tx_plss/wms?', {
       layers: 'Culture',
       format: 'image/png8',
       transparent: true,
       styles: '',
       attribution: null
     }).addTo(this.map);

    this.plssLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/tx_plss/wms?', {
       layers: 'National_PLSS',
       format: 'image/png8',
       transparent: true,
       styles: '',
       attribution: null
     }).addTo(this.map);

     this.wellsLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/Wells/wms?', {
       layers: 'OK_Wells',
       format: 'image/png8',
       transparent: true,
       styles: '',
       attribution: null
     }).addTo(this.map);
  }

 
}
