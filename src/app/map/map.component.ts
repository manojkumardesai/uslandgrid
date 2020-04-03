import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { BetterWMS } from '../utils/betterWms.util';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService } from '../_services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from '../utils/matDialog/matDialog.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit, OnInit {
  public map;
  public infoPointMarker;
  public tiles;
  public cultureLayer;
  public plssLayer;
  public wellsLayer;
  payLoadFromFilter = {};
  name: string;
  myControl = new FormControl();
  options: any[] = [];
  filteredOptions: Observable<any[]>;
  constructor(public apiService: ApiService,
    public dialog: MatDialog) { }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialog, {
      width: '400px',
      data: this.payLoadFromFilter
    });

    dialogRef.afterClosed().subscribe(result => {
      this.payLoadFromFilter = result ? JSON.parse(JSON.stringify(result)) : {};
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(name => this._filter(name))
      );
  }

  private _filter(value: any): Observable<any[]> {
    return this.apiService.searchWells(value).pipe(
      map(response => response.wellDtos.filter(option => {
        return option
      }))
    )
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  searchWellsByKey(key) {
    this.apiService.searchWells(key).subscribe((data) => {
      this.options = data.wellDtos;
    });
    return this.options;
  }

  displayFn(well): string {
    return well && well.wellName ? well.wellName : '';
  }

  goToSelectedWell(option) {
    this.goToLocation(option.latitude, option.longitude);
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [35.420372, -98.512855],
      zoom: 8
    });
    this.map.on('moveend', () => {
      console.log(this.map.getBounds());
    });
    this.map.on('click', (ev) => {
      this.apiService.fetchInfoPoint(ev.latlng).subscribe((data: any) => {
        console.log('infoPoint', data);
        if (this.infoPointMarker) {
          this.map.removeLayer(this.infoPointMarker);
        }
        if (data.length) {
          this.infoPointMarker = new L.Marker(ev.latlng, {
            draggable: true
          });


          this.map.addLayer(this.infoPointMarker);
          this.infoPointMarker.bindPopup(`
          <style>
          div > label {
            display: block;
          }
          </style>
          <div>
            <h3>Info Window</h3>
            <div>
            <label>Well Id: ${data[0].wellId}</label>
            <label>Well Name: ${data[0].wellName}</label>
            <label>Operator: ${data[0].operator}</label>
            <label>Well Number: ${data[0].wellNumber}</label>
            <label>Status: ${data[0].status}</label>
            <label>Latitude: ${data[0].latitude}</label>
            <label>Longitude: ${data[0].longitude}</label>
            <label>Spud Date: ${data[0].spudDate}</label>
            <label>Completion Date: ${data[0].completionDate}</label>
            <label>Datum Type: ${data[0].datumType}</label>
            <label>TVD: ${data[0].tvd}</label>
            <label>State: ${data[0].state}</label>
            <label>County: ${data[0].county}</label>
          </div>
            `).openPopup();

        }
      });
    });
    this.addTileLayer();
    // this.addCultureLayer();
    this.addPlssLayer();
    this.addWellsLayer();
    // Pass url and options to below function in the mentioned comment and uncomment it
    //  L.tileLayer.prototype.betterWms = this.betterWmsFunction(url, options);
  }

  addTileLayer() {
    this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 4,
      maxZoom: 20,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  addCultureLayer() {
    this.cultureLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/culture1/wms?', {
      layers: 'Culture',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    }).addTo(this.map);
  }

  addPlssLayer() {
    this.plssLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/national_plss/wms?', {
      layers: 'National_PLSS',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    }).addTo(this.map);
  }

  addWellsLayer() {
    this.wellsLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/Wells/wms?', {
      layers: 'OK_Wells',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    }).addTo(this.map);
  }

  betterWmsFunction(url?, options?) {
    return new BetterWMS(url, options, this.map);
  }

  currentLocation() {
    this.map.locate({ setView: true });
  }

  homeLocation() {
    this.map.setView(new L.LatLng(35.420372, -98.512855), 8);
  }

  goToLocation(lat, lng) {
    this.map.setView(new L.LatLng(lat, lng), 12);
  }
}
