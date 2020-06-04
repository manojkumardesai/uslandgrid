import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { BetterWMS } from '../utils/betterWms.util';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService } from '../_services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FilterDialog } from '../utils/matDialog/filterDialog.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import "leaflet-mouse-position";
import "leaflet.markercluster";
import * as esri from "esri-leaflet";

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
  public esriBaseLayer;
  public esriImageryLayer;
  public cultureLayer;
  public plssLayer;
  public wellsLayer;
  public clusterLayer;
  public circleMarker;
  public infoWindowDialog;
  public isMapExtentApplied = false;
  payLoadFromFilter = [];
  public mapExtent = [];
  public clusterTestData = [];
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
    this.fetchClusterData();
  }

  fetchClusterData() {
     this.apiService.fetchClusters().subscribe((clusterData) => {
       this.clusterTestData = [...clusterData];
       this.addClusterLayer();
     });
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
      center: [38.417301, -97.075195],
      zoom: 5
    });
    this.map.on('moveend', () => {
      if (this.isMapExtentApplied) {
        this.filterEmit(this.isMapExtentApplied);
      }
    });
    this.map.on('click', (ev) => {
      this.showInfoPoint(ev);
    });
    this.map.on('map-container-resize', () => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 400)
    });

    //Control the cluster visibility based on zoom level
    this.map.on("zoomend", () => {
      let zoom = this.map.getZoom();
      if(zoom > 11) {
        this.map.removeLayer(this.clusterLayer);
      } else {
        if(!this.map.hasLayer(this.clusterLayer)) {
          this.map.addLayer(this.clusterLayer);
        }
      }
    });
    this.addTileLayer();
    this.addCultureLayer();
    this.addPlssLayer();
    this.addWellsLayer();
    this.layerControl();
    //this.addClusterLayer();
    // Pass url and options to below function in the mentioned comment and uncomment it
    //  L.tileLayer.prototype.betterWms = this.betterWmsFunction(url, options);

  }

  addTileLayer() {
    this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 4,
      maxZoom: 20,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    //this.map.addLayer(this.tiles);

    //Streets, Topographic, NationalGeographic, Oceans, Gray, DarkGray, Imagery, ImageryClarity, ImageryFirefly, ShadedRelief, Terrain, USATopo, Physical
    this.esriBaseLayer = esri.basemapLayer('Gray');
    this.esriImageryLayer = esri.basemapLayer('Imagery');
    this.map.addLayer(this.esriBaseLayer);
  }

  addCultureLayer() {
    this.cultureLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/Culture1/wms?', {
      layers: 'Culture',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    });
    //this.map.addLayer(this.cultureLayer);
  }

  addPlssLayer() {
    this.plssLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/national_plss/wms?', {
      layers: 'National_PLSS',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    });
    //this.map.addLayer(this.plssLayer);
  }

  addWellsLayer() {
    this.wellsLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/Wells/wms?', {
      layers: 'wh_final',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    });
    this.map.addLayer(this.wellsLayer);
  }

  addClusterLayer() {
    //Adding Cluster layer
    this.clusterLayer = L.markerClusterGroup({
      //disableClusteringAtZoom: 8,
      showCoverageOnHover: false,
      /*iconCreateFunction: function (cluster) {
        return L.divIcon({
          iconSize: null
        });
      }*/
      
    });

    //clustermarker
    let clusterMarkerOptions = {
      radius: 3,
      fillColor: "#ab0972",
      color: "#df098",
      weight: 1,
      opacity: 0.2,
      fillOpacity: 0.5
    };

    var mapIcon = L.icon({
      iconUrl: 'https://cdn.iconscout.com/icon/free/png-256/dot-22-433567.png',
      iconSize: [30, 30]
    });


    for (var i = 0; i < this.clusterTestData.length; i++) {
      var a = this.clusterTestData[i];
      var title = a[2];
      var marker = L.marker(new L.LatLng(a[0], a[1]), { icon: mapIcon });
      //marker.bindPopup(title);
      this.clusterLayer.addLayer(marker);
    }

    this.map.addLayer(this.clusterLayer);
  }

  layerControl() {
    let baseLayerMaps = {};
    let overLay = {
      'Base Map': this.esriBaseLayer,
      'Satellite': this.esriImageryLayer,
      'Wells': this.wellsLayer,
      'PLSS': this.plssLayer
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
    this.map.setView(new L.LatLng(38.417301, -97.075195), 5);
  }

  goToLocation(lat, lng) {
    this.map.setView(new L.LatLng(lat, lng), 12);
  }

  showInfoPoint(ev) {
    this.apiService.fetchInfoPoint(ev.latlng).subscribe((data: any) => {
      if (data.length) {
        if (this.infoWindowDialog) {
          this.infoWindowDialog.close();
        }
        this.infoWindowDialog = this.dialog.open(InfoWindowComponent, {
          width: '350px',
          maxWidth: 350,
          backdropClass: 'cdk-overlay-transparent-backdrop',
          hasBackdrop: false,
          data
        });
        this.infoWindowDialog.afterClosed().subscribe((data) => console.log());
      }
    });
  }

  filterEmit(event) {
    if (event) {
      this.isMapExtentApplied = true;
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
      this.isMapExtentApplied = false;
      this.mapExtent = [];
    }
  }
  zoomToEmit(event) {
    this.goToLocation(event[0].latitude, event[0].longitude);
  }
  clear(event) {
    this.markWell(null);
  }
  refreshEmit(event) {
    // this.mapExtent = [];
  }

  markWell($event) {
    if (!$event) {
      this.circleMarker.remove();
    } else {
      let { latitude, longitude } = $event;
      // this.goToLocation(latitude, longitude);
      this.circleMarker = L.circle([latitude, longitude], {
        color: '#0ff',
        fillColor: '#0ff',
        fillOpacity: 0.2,
        radius: 200
      }).addTo(this.map);
    }
  }

  clearSearchInput() {
    this.myControl.patchValue('');
  }
}
