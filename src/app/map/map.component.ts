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
import "leaflet-draw";
import { idLocale } from 'ngx-bootstrap/chronos';
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
  public clusterTestData; any = [];
  name: string;
  formats = [];
  reportType = '';
  myControl = new FormControl();
  options: any[] = [];
  base_layer: any;
  satelight_layer: any;
  wells_layer: any;
  culture_layer: any;
  psll_layer: any;
  filteredOptions: Observable<any[]>;
  clusterSubcribe: any;
  circleGroup = L.featureGroup();
  clusterGroup = L.layerGroup();
  editableLayers = new L.featureGroup();
  drawingPoints: any = [];
  isShapeDrawn: boolean = false;
  infoPointLayers = L.featureGroup();

  drawPluginOptions = {
    position: 'bottomright',
    draw: {
      polygon: {
        allowIntersection: false,
        drawError: {
          color: '#e1e100',
          message: '<strong>Oh snap!<strong> you can\'t draw that!'
        },
        shapeOptions: {
          color: '#305496',
          fill: null,
          fillColor: null,
          fillOpacity: 0.5,
          opacity: 1,
        }
      },
      polyline: false,
      circle: false,
      rectangle: {
        showArea: false,
        shapeOptions: {
          clickable: false,
          color: "#305496",
          fill: null,
          fillColor: null,
          fillOpacity: 0.5,
          opacity: 1,
          stroke: true,
          weight: 4,
        }
      },
      marker: false,
      circlemarker: false
    },
    edit: {
      featureGroup: this.editableLayers,
      edit: false,
      remove: true
    }
  };

  drawControl = new L.Control.Draw(this.drawPluginOptions);

  exportLayer = L.control({ position: 'bottomright' });

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
    this.getAllocatedFileTypes();
  }

  fetchClusterData() {
    // if (this.apiService.clusterTestData.length == 0) {
    //   const cluster1 = this.apiService.fetchClusters(0, 100000);
    //   const cluster2 = this.apiService.fetchClusters(100001, 100000);
    //   const cluster3 = this.apiService.fetchClusters(200001, 100000);
    //   const cluster4 = this.apiService.fetchClusters(300001, 100000);
    //   const cluster5 = this.apiService.fetchClusters(400001, 100000);
    //   const mergedCall = forkJoin(cluster1, cluster2, cluster3, cluster4, cluster5);
    //   mergedCall.subscribe((clusterData: any) => {
    //     this.apiService.clusterTestData = clusterData.flat(1);
    //     this.addClusterLayer();
    //   });
    // }
    // else {
    //   setTimeout(() => {
    //     this.addClusterLayer();
    //   }, 1000);
    // }
    this.clusterData();
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

    this.base_layer = $('input[type=checkbox]')[0];
    this.satelight_layer = $('input[type=checkbox]')[1];
    this.culture_layer = $('input[type=checkbox]')[2];
    this.psll_layer = $('input[type=checkbox]')[3];
    this.wells_layer = $('input[type=checkbox]')[4];
  }

  @HostListener('change') onChange(e: any) {
    if (this.base_layer.checked) {
      this.miniMap.addLayer(this.esriBaseLayer)
    } else {
      if (this.miniMap.hasLayer(this.esriBaseLayer)) {
        this.miniMap.removeLayer(this.esriBaseLayer)
        this.miniMap.clearLayers(this.esriBaseLayer)
      }
    }
    if (this.satelight_layer.checked) {
      this.esriImageryLayer = esri.basemapLayer('Imagery');
      this.miniMap.addLayer(this.esriImageryLayer);
    } else {
      if (this.miniMap.hasLayer(this.esriImageryLayer)) {
        this.miniMap.removeLayer(this.esriImageryLayer)
        this.miniMap.clearLayers(this.esriImageryLayer)
      }
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
      if (this.editableLayers) {
        this.editableLayers.clearLayers();
      }
      if (zoom <= 11) {
        this.clusterData();
      } else {
        this.map.removeLayer(this.circleGroup);
        this.circleGroup.clearLayers();
      }
      // if (zoom > 11) {
      //   this.map.removeLayer(this.clusterLayer);
      // } else {
      //   if (!this.map.hasLayer(this.clusterLayer)) {
      //     this.map.addLayer(this.clusterLayer);
      //   }
      // };
    });
    this.addTileLayer();
    this.addCultureLayer();
    this.addPlssLayer();
    this.addWellsLayer();
    this.layerControl();
    this.addExport();
    this.map.addControl(this.drawControl);
    this.map.addLayer(this.editableLayers);

    this.map.on('draw:created', (e) => {
      if (this.editableLayers) {
        this.editableLayers.clearLayers();
      }
      if (this.infoPointLayers) {
        this.infoPointLayers.clearLayers();
      }
      var layer = e.layer;
      this.filterEmitForShapes(layer)
      this.editableLayers.addLayer(layer);
    });

    this.map.on('draw:deleted', (e) => {
      this.filterEmit(this.isMapExtentApplied);
      if (this.infoPointLayers) {
        this.infoPointLayers.clearLayers();
      }

    });
    this.map.on('draw:drawstart', (e) => {
      this.isShapeDrawn = true;
    });
    this.map.on('draw:drawstop', (e) => {
      this.isShapeDrawn = false;
    })
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
      var title = a.count;
      var marker = L.marker(new L.LatLng(+a.latitude.toFixed(2), +a.longitude.toFixed(2)), { icon: mapIcon });
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

  goToLocationAlaska(lat, lng) {
    this.map.setView(new L.LatLng(lat, lng), 5);
  }
  showInfoPoint(ev) {
    if (this.map.getZoom() > 11 && !this.isShapeDrawn) {
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

  filterEmitForShapes(event) {
    if (event) {
      this.isMapExtentApplied = true;
      const extent = event;
      const points = [];
      extent._latlngs[0].forEach(point => {
        points.push({
          lat: point.lat,
          lon: point.lng
        });
      });
      points.push(points[0]);
      this.mapExtent = points; // Sends new points to child component
      this.drawInfoPoints(this.mapExtent);
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

  clusterData() {
    setTimeout(() => {
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
      this.mapExtent = points;

      if (this.clusterSubcribe) {
        this.clusterSubcribe.unsubscribe();
        if (this.circleGroup) {
          this.map.removeLayer(this.circleGroup);
          this.circleGroup.clearLayers();
        }
        this.drawCircle();
      } else {
        this.drawCircle();
      }

    }, 10);

  }

  drawCircle() {
    var myIcon = L.divIcon({ className: 'my-div-icon' });
    this.clusterSubcribe = this.apiService.cluster({ points: this.mapExtent, zoom: this.map.getZoom() }).subscribe(val => {
      if (this.circleGroup) {
        this.map.removeLayer(this.circleGroup);
        this.circleGroup.clearLayers();
      }
      this.clusterTestData = val;
      for (let i = 0; i < this.clusterTestData.length; i++) {
        var circleOptions = {
          color: 'rgba(110,204,57,.6)',
          fillColor: 'rgba(110,204,57,.6)',
          fillOpacity: 1,
          radius: this.generateRadius(this.clusterTestData[i].count),
        }
        var circle = L.circleMarker([this.clusterTestData[i].latitude, this.clusterTestData[i].longitude], circleOptions);
        let dvText = L.marker([this.clusterTestData[i].latitude, this.clusterTestData[i].longitude], { icon: myIcon });
        circle.addTo(this.circleGroup);
        dvText.addTo(this.circleGroup);
        this.map.addLayer(this.circleGroup);
        document.getElementsByClassName('my-div-icon')[i].innerHTML = this.clusterTestData[i].count;
        document.getElementsByClassName('my-div-icon')[i]['style'].marginLeft = this.generateLeftMargin(this.clusterTestData[i].count);
        document.getElementsByClassName('my-div-icon')[i]['style'].marginTop = this.generatetopMargin(this.clusterTestData[i].count);
      }
    });
  }

  generateRadius(num) {
    if (num.toString().length == 1) {
      return 8;
    }
    if (num.toString().length == 2) {
      return 11;
    }
    if (num.toString().length == 3) {
      return 15;
    }
    if (num.toString().length == 4) {
      return 20;
    }
    if (num.toString().length == 5) {
      return 23;
    }
    if (num.toString().length == 6) {
      return 26
    }
  }

  generateLeftMargin(num) {
    if (num.toString().length == 1) {
      return '-5px'
    }
    if (num.toString().length == 2) {
      return '-6px'
    }
    if (num.toString().length == 3) {
      return '-9px'
    }
    if (num.toString().length == 4) {
      return '-13px'
    }
    if (num.toString().length == 5) {
      return '-15px'
    }
    if (num.toString().length == 6) {
      return '-20px'
    }
  }

  generatetopMargin(num) {
    if (num.toString().length == 1) {
      return '-8px'
    }
    if (num.toString().length == 2) {
      return '-8px'
    }
    if (num.toString().length == 3) {
      return '-8px'
    }
    if (num.toString().length == 4) {
      return '-8px'
    }
    if (num.toString().length == 5) {
      return '-7px'
    }
    if (num.toString().length == 6) {
      return '-7'
    }
  }

  drawInfoPoints(data) {
    let zoom = this.map.getZoom();
    if (zoom > 11) {
      this.apiService.infoPoint({ limit: 10, offset: 0, points: data }).subscribe((coords: []) => {

        coords['wellDtos'].forEach(coord => {
          let circle = L.circle([coord['latitude'], coord['longitude']], {
            color: '#0ff',
            fillColor: '#0ff',
            fillOpacity: 0.2,
            radius: 200
          });
          this.infoPointLayers.addLayer(circle);

        })
        this.map.addLayer(this.infoPointLayers);
      });
    }
  }

  addExport() {
    this.editableLayers.onAdd = () => {
      var div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = '<select><option>1</option><option>2</option><option>3</option></select>';
      div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
      return div;
    };
    this.editableLayers.addTo(this.map);
  }

  getAllocatedFileTypes() {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    let id = userInfo.userId;
    this.apiService.userDetails(id).subscribe(user => {
      this.formats = user['userPermissionDto']['reportTypes'];
    });

  }

  stopCloseDropdown($event) {
    $event.stopPropagation();
  }


  exportReport() {
    const payload = {};
    payload['reportType'] = this.reportType;
    payload['mapxExtent'] = this.mapExtent;
    console.log(payload);
  }
}
