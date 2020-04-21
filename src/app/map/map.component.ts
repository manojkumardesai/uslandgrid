import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { BetterWMS } from '../utils/betterWms.util';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService } from '../_services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialog } from '../utils/matDialog/filterDialog.component';
import "leaflet-mouse-position";

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
  public circleMarker;
  payLoadFromFilter = [];
  public mapExtent = [];
  name: string;
  myControl = new FormControl();
  options: any[] = [];
  filteredOptions: Observable<any[]>;
  constructor(public apiService: ApiService,
    public dialog: MatDialog) { }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialog, {
      width: '350px',
      maxWidth: 350,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: true,
      data: this.payLoadFromFilter
    });

    dialogRef.afterClosed().subscribe(result => {
      const wellsCriteria = result ? JSON.parse(JSON.stringify(result)).wellsCriteria : {};
      if (Object.keys(wellsCriteria).length && wellsCriteria[0].field) {
        delete wellsCriteria[wellsCriteria.length - 1].operator;
        this.payLoadFromFilter = wellsCriteria;
      } else {
        this.payLoadFromFilter = [];
      }
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((name) => {
          return this._filter(name);
        })
      );
  }

  private _filter(value: any): Observable<any[]> {
    const key = value.length ? value : value.wellName;
    return this.apiService.fetchWellsData({ searchKey: key }).pipe(
      map(response => response.wellDtos.filter(option => {
        return option
      }))
    )
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  displayFn(well): string {
    return well && well.wellName ? well.wellName : '';
  }

  goToSelectedWell(option) {
    this.goToLocation(option.latitude, option.longitude);
    const event = {
      latlng: {
        lat: option.latitude,
        lng: option.longitude
      }
    };
    this.showInfoPoint(event);
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
      this.showInfoPoint(ev);
    });
    this.map.on('map-container-resize', () => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 400)
    });
    this.addTileLayer();
    // this.addCultureLayer();
    this.addPlssLayer();
    this.addWellsLayer();
    this.layerControl();
    // Pass url and options to below function in the mentioned comment and uncomment it
    //  L.tileLayer.prototype.betterWms = this.betterWmsFunction(url, options);
  }

  addTileLayer() {
    this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 4,
      maxZoom: 20,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    this.map.addLayer(this.tiles);
  }

  addCultureLayer() {
    this.cultureLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/culture1/wms?', {
      layers: 'Culture',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    });
    this.map.addLayer(this.cultureLayer);
  }

  addPlssLayer() {
    this.plssLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/national_plss/wms?', {
      layers: 'National_PLSS',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    });
    this.map.addLayer(this.plssLayer);
  }

  addWellsLayer() {
    this.wellsLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/Wells/wms?', {
      layers: 'OK_Wells',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    });
    this.map.addLayer(this.wellsLayer);
  }

  layerControl() {
    let baseLayerMaps = {
      'Layers': this.tiles
    };
    let overLay = {
      'Wells': this.wellsLayer,
      'PLSS': this.plssLayer,
    }
    L.control.layers(baseLayerMaps, overLay).addTo(this.map);
    L.control.mousePosition().addTo(this.map);
    L.control.scale().addTo(this.map);
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

  showInfoPoint(ev) {
    this.apiService.fetchInfoPoint(ev.latlng).subscribe((data: any) => {
      if (this.infoPointMarker) {
        this.map.removeLayer(this.infoPointMarker);
      }
      if (data.length) {
        this.infoPointMarker = new L.Marker(ev.latlng, {
          opacity: 0,
          draggable: true,
        });
        this.map.addLayer(this.infoPointMarker);
        this.infoPointMarker.bindPopup(`
        <style>
        .hzLine {
          border: none;
          border-top: 1px solid #333333;
          margin-top: 6px;
          margin-bottom: 6px;
        }
        .attrName {
          color: #888888;
          padding-right: 5px;
        }
        </style>
        <div>
          <div class="header">USLandgrid Well: ${data[0].wellName}</div>
          <div class="hzLine"></div>
          <div>
          <table>
            <tr>
              <td class="attrName">well_id</td>
              <td>${data[0].wellId}</td>
            </tr>
            <tr>
              <td class="attrName">well_name</td>
              <td>${data[0].wellName}</td>
            </tr>
            <tr>
              <td class="attrName">operator</td>
              <td>${data[0].operator}</td>
            </tr>
            <tr>
              <td class="attrName">well_number</td>
              <td>${data[0].wellNumber}</td>
            </tr>
            <tr>
              <td class="attrName">status</td>
              <td>${data[0].status}</td>
            </tr>
            <tr>
              <td class="attrName">latitude</td>
              <td>${data[0].latitude}</td>
            </tr>
            <tr>
              <td class="attrName">longitude</td>
              <td>${data[0].longitude}</td>
            </tr>
            <tr>
              <td class="attrName">spud_date</td>
              <td>${data[0].spudDate}</td>
            </tr>
            <tr>
              <td class="attrName">completion_date</td>
              <td>${data[0].completionDate}</td>
            </tr>
            <tr>
              <td class="attrName">datum_type</td>
              <td>${data[0].datumType}</td>
            </tr>
            <tr>
              <td class="attrName">tvd</td>
              <td>${data[0].tvd}</td>
            </tr>
            <tr>
              <td class="attrName">state</td>
              <td>${data[0].state}</td>
            </tr>
            <tr>
              <td class="attrName">county</td>
              <td>${data[0].county}</td>
            </tr>
          </table>
        </div>
        `).openPopup();
      }
    });
  }

  filterEmit(event) {
    if (event) {
      const extent = this.map.getBounds();
      const points = [{
        lat: extent.getNorthWest().lat,
        lon: extent.getNorthWest().lng
      }, {
        lat: extent._northEast.lat,
        lon: extent._northEast.lng
      }, {
        lat: extent.getSouthEast().lat,
        lon: extent.getSouthEast().lng
      }, {
        lat: extent._southWest.lat,
        lon: extent._southWest.lng
      }, {
        lat: extent.getNorthWest().lat,
        lon: extent.getNorthWest().lng
      }];
      this.mapExtent = points; // Sends new points to child component
    } else {
      this.mapExtent = [];
    }
  }
  zoomToEmit(event) {
    this.goToSelectedWell(event[0]);
  }
  clear(event) {
    console.log('clear', event);
  }
  refreshEmit(event) {
    console.log('refresh', event);
  }

  markWell($event) {
    if (!$event) {
      this.circleMarker.remove();
    } else {
      let { latitude, longitude } = $event;
      this.goToLocation(latitude, longitude);
      this.circleMarker = L.circle([latitude, longitude], {
        color: 'blue',
        fillColor: '#00f',
        fillOpacity: 0.2,
        radius: 200
      }).addTo(this.map);
    }
  }
}
