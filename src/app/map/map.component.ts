import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { BetterWMS } from '../utils/betterWms.util';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
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
  public tiles;
  public cultureLayer;
  public plssLayer;
  public wellsLayer;
  payLoadFromFilter: string;
  name: string;
  myControl = new FormControl();
  options: any[] = [];
  filteredOptions: Observable<string[]>;
  constructor(public apiService: ApiService,
    public dialog: MatDialog) { }
  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialog, {
      width: '400px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.payLoadFromFilter = result;
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.wellName),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();
    this.searchWellsByKey(filterValue);
    return this.options.filter(option => option.wellName.toLowerCase().indexOf(filterValue) === 0);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  searchWellsByKey(key) {
    this.apiService.searchWells(key).subscribe((data) => {
      this.options = data.wellDtos;
    });
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
    this.addTileLayer();
    this.addCultureLayer();
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
