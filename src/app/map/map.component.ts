import { Component, AfterViewInit, OnInit, HostListener } from '@angular/core';
import * as L from 'leaflet';
import { BetterWMS } from '../utils/betterWms.util';
import { FormControl } from '@angular/forms';
import { Observable, merge, forkJoin } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService } from '../_services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FilterDialog } from '../utils/matDialog/filterDialog.component';
import { InfoWindowComponent } from './info-window/info-window.component';
import "leaflet-mouse-position";
import "leaflet.markercluster";
import * as esri from "esri-leaflet";
declare var $: any

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
  public miniMap;
  public infoPointMarker;
  public tiles;
  public esriBaseLayer;
  public esriImageryLayer;
  public cultureLayer;
  public plssLayer;
  public wellsLayer;
  public clusterLayer;
  public openAdvancedFilter = false;
  public circleMarker;
  public infoWindowDialog;
  public isMapExtentApplied = false;
  payLoadFromFilter = [];
  public mapExtent = [];
  public clusterTestData = [];
  name: string;
  myControl = new FormControl();
  options: any[] = [];
  satelight_layer: any;
  wells_layer: any;
  culture_layer: any;
  psll_layer: any;
  filteredOptions: Observable<any[]>;
  constructor(public apiService: ApiService,
    public dialog: MatDialog) { }

  openFilterDialog($event): void {
    this.openAdvancedFilter = true;
    // const dialogRef = this.dialog.open(FilterDialog, {
    //   width: '350px',
    //   maxWidth: 350,
    //   backdropClass: 'cdk-overlay-transparent-backdrop',
    //   hasBackdrop: true,
    //   data: this.payLoadFromFilter
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   const wellsCriteria = result ? JSON.parse(JSON.stringify(result)).wellsCriteria : {};
    //   if (Object.keys(wellsCriteria).length && wellsCriteria[0].field) {
    //     this.payLoadFromFilter = wellsCriteria;
    //   } else {
    //     this.payLoadFromFilter = [];
    //   }
    // });
  }

  openAdvancedFilterEvent(event) {
    this.openAdvancedFilter = false;
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
    const cluster1 = this.apiService.fetchClusters(0, 100000);
    const cluster2 = this.apiService.fetchClusters(100001, 100000);
    const cluster3 = this.apiService.fetchClusters(200001, 100000);
    const cluster4 = this.apiService.fetchClusters(300001, 100000);
    const cluster5 = this.apiService.fetchClusters(400001, 100000);
    const mergedCall = forkJoin(cluster1, cluster2, cluster3, cluster4, cluster5);
    mergedCall.subscribe((clusterData: any) => {
      this.clusterTestData = clusterData.flat(1);
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
    this.initMiniMap();

    this.satelight_layer = $('input[type=checkbox]')[1];
    this.culture_layer = $('input[type=checkbox]')[2];
    this.psll_layer = $('input[type=checkbox]')[3];
    this.wells_layer = $('input[type=checkbox]')[4];
  }

  @HostListener('change') onChange(e: any) {
    if (this.satelight_layer.checked) {
      this.esriImageryLayer = esri.basemapLayer('Imagery');
      this.miniMap.addLayer(this.esriImageryLayer);
    } else {
      this.esriBaseLayer = esri.basemapLayer('Gray');
      this.miniMap.addLayer(this.esriBaseLayer);
    }
    if (this.culture_layer.checked) {
      this.cultureLayer = L.tileLayer.wms('https://maps.uslandgrid.com/geoserver/culture_webmap/wms?', {
        layers: 'culture_webmap:Culture_Webmap',
        format: 'image/png8',
        transparent: true,
        styles: '',
        attribution: null
      });
      this.miniMap.addLayer(this.cultureLayer);
    } else {
      this.miniMap.removeLayer(this.cultureLayer);
    }
    if (this.psll_layer.checked) {
      this.plssLayer = L.tileLayer.wms('https://maps.uslandgrid.com/geoserver/landgrid_webmap/wms?', {
        layers: 'landgrid_webmap:LandGrid_WebMap',
        format: 'image/png8',
        transparent: true,
        styles: '',
        attribution: null
      });
      this.miniMap.addLayer(this.plssLayer);
    } else {
      this.miniMap.removeLayer(this.plssLayer);
    }
    if (this.wells_layer.checkbox) {
      this.wellsLayer = L.tileLayer.wms('https://maps.uslandgrid.com/geoserver/Wells/wms?', {
        layers: 'wh_final',
        format: 'image/png8',
        transparent: true,
        styles: '',
        attribution: null
      });
      this.miniMap.addLayer(this.wellsLayer);
    } else {
      this.miniMap.removeLayer(this.wellsLayer);
    }
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
    this.markWell(option);
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
      if (this.map.getZoom() > 11) {
        this.showInfoPoint(ev);
      }
    });
    this.map.on('map-container-resize', () => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 400)
    });

    //Control the cluster visibility based on zoom level
    this.map.on("zoomend", () => {
      let zoom = this.map.getZoom();
      if (zoom > 11) {
        this.map.removeLayer(this.clusterLayer);
      } else {
        if (!this.map.hasLayer(this.clusterLayer)) {
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

  initMiniMap(): void {
    this.miniMap = L.map('mini-map', {
      center: [65.1605, -153.3691],
      zoom: 3,
      zoomControl: false
    });
    this.esriBaseLayer = esri.basemapLayer('Gray');
    this.miniMap.addLayer(this.esriBaseLayer);
    this.addWellsLayer_1();
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
    this.cultureLayer = L.tileLayer.wms('https://maps.uslandgrid.com/geoserver/culture_webmap/wms?', {
      layers: 'culture_webmap:Culture_Webmap',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    });
    this.map.addLayer(this.cultureLayer);
  }

  addPlssLayer() {
    this.plssLayer = L.tileLayer.wms('https://maps.uslandgrid.com/geoserver/landgrid_webmap/wms?', {
      layers: 'landgrid_webmap:LandGrid_WebMap',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    });
    //this.map.addLayer(this.plssLayer);
  }

  addWellsLayer() {
    this.wellsLayer = L.tileLayer.wms('https://maps.uslandgrid.com/geoserver/Wells/wms?', {
      layers: 'wh_final',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    });
    this.map.addLayer(this.wellsLayer);
  }

  addWellsLayer_1() {
    this.wellsLayer = L.tileLayer.wms('https://maps.uslandgrid.com/geoserver/Wells/wms?', {
      layers: 'wh_final',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    });
    this.miniMap.addLayer(this.wellsLayer);
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
      iconUrl: '../assets/dot.png',
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
      'Culture': this.cultureLayer,
      'PLSS': this.plssLayer,
      'Wells': this.wellsLayer

    }
    L.control.layers(baseLayerMaps, overLay).addTo(this.map);
    L.control.mousePosition().addTo(this.map);
    L.control.scale().addTo(this.map);
  }

  layerControl_1() {
    let baseLayerMaps = {};
    let overLay = {
      'Base Map': this.esriBaseLayer,
      'Satellite': this.esriImageryLayer,
      // 'Culture': this.cultureLayer,
      // 'PLSS': this.plssLayer,
      // 'Wells': this.wellsLayer

    }
    L.control.layers(baseLayerMaps, overLay).addTo(this.miniMap);
    L.control.mousePosition().addTo(this.miniMap);
    L.control.scale().addTo(this.miniMap);
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
    if (this.map.getZoom() > 11) {
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
          this.infoWindowDialog.afterClosed().subscribe((data) => {
            this.markWell(null);
          });
        }
      });
    }
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
