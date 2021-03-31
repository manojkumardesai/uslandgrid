import { Component, AfterViewInit, OnInit, HostListener, Host } from '@angular/core';
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
import { saveAs } from 'file-saver';
import "leaflet-draw";
import { WarningWindowComponent } from '../dilogs/warning-window/warning-window.component';
import { LoginService } from '../_services/login.service';
import * as wms from 'leaflet.wms';
declare var $: any
L.drawLocal.draw.handlers.polygon.tooltip.end = '<b>Click the finish button to close the polygon / Click first point to close this shape.</b>';
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
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
  public mapTownShipExtent: any;
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
  tablePointLayers = L.featureGroup();
  yellowPointLayers = L.featureGroup();
  isShapeExporting = false;
  isInfoWindowOpened = false;
  infoPointInfo: any;
  isTownshipIsActive = false;
  townshipType = '';
  drawPluginOptions = {
    position: 'topleft',
    draw: {
      polygon: {
        allowIntersection: false,
        repeatMode: false,
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
        repeatMode: false,
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
  activeTownship = false;
  activeSection = false;
  activeQuarter = false;
  activeCounty = false;
  subscription: any = [];
  multiSelectPoints = [];
  infoPointsSubscriber: any;
  deleteButton: any;
  selectedArea = L.featureGroup();
  numberOfClick = 0;
  constructor(public apiService: ApiService,
    public dialog: MatDialog,
    public userService: LoginService) { }

  openFilterDialog($event): void {
    if ((this.editableLayers && Object.keys(this.editableLayers._layers).length) ||
      (this.activeTownship || this.activeSection || this.activeQuarter || this.activeCounty)) {
      const dialogRef = this.dialog.open(WarningWindowComponent, {
        data: {
          mesg: 'Do you want to clear previous selection?',
          confirm: true,
        }
      });
      dialogRef.afterClosed().subscribe(val => {
        if (val === 'true') {
          if (this.editableLayers) {
            this.editableLayers.clearLayers();
          }
          if (this.infoPointLayers) {
            this.infoPointLayers.clearLayers();
          }
          if(this.selectedArea) {
            this.selectedArea.clearLayers();
          }
          this.activeTownship = false;
          this.activeSection = false;
          this.activeQuarter = false;
          this.activeCounty = false;
          this.apiService.loadResetTable(true);
          this.apiService.loadAdvanceFilter(true);
        }
      });
    } else {
      this.apiService.loadAdvanceFilter(true);
    }

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

    this.subscription.push(
      this.apiService.filterByMapSubject.subscribe(val => {
        if (val) {
          this.apiService.emitMapExtent(this.getMapExtent());
        }
      })
    );

    this.subscription.push(
      this.apiService.zoomToSubject.subscribe(val => {
        this.zoomToEmit(val);
      })
    );

    this.subscription.push(
      this.apiService.tabpointsSubject.subscribe(val => {
        this.tablePointLayers.clearLayers();
        this.infoPointInfo = [];
        this.markWell(null);
        this.dialog.closeAll();
        if(this.yellowPointLayers) {
          this.yellowPointLayers.clearLayers();
        }
        this.apiService.emitSelectedWellIds([]);
      })
    );

    this.apiService.yellowPointsSubject.subscribe(wells => {
      this.markTableWelsSelection(wells)
    });
    this.subscription.push(
      this.apiService.resizeMapSubject.subscribe(val => {
        if (val) {
          setTimeout(() => {
            this.map.invalidateSize();
          }, 400);
        }
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

  fetchClusterData() {
    this.apiService.globalLoader = true;
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

  ngAfterViewInit(): void {
    this.initMap();
    this.initMiniMap();

    this.base_layer = $('.leaflet-control-layers-overlays input:checkbox')[0];
    this.satelight_layer = $('.leaflet-control-layers-overlays input:checkbox')[1];
    this.culture_layer = $('.leaflet-control-layers-overlays input:checkbox')[2];
    this.psll_layer = $('.leaflet-control-layers-overlays input:checkbox')[3];
    this.wells_layer = $('.leaflet-control-layers-overlays input:checkbox')[4];
    this.deleteButton = $('.leaflet-draw-edit-remove').removeClass('leaflet-disabled').addClass('leaflet-enabled');
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
    if(this.infoPointsSubscriber) {
      this.infoPointsSubscriber.unsubscribe();
      this.showInfoPoint(event);
    } else {
      this.showInfoPoint(event);
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [38.417301, -97.075195],
      zoom: 5,
    });
    this.map.on('click', (ev) => {
      if(this.infoPointsSubscriber) {
        this.infoPointsSubscriber.unsubscribe();
        this.showInfoPoint(ev);
      } else {
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
          if(this.wells_layer.checked) {
            this.map.addLayer(this.clusterLayer);
          }
        }
      }
    });

    this.addTileLayer();
    this.addCultureLayer();
    this.addPlssLayer();
    this.addWellsLayer();
    this.layerControl();
    this.map.addControl(this.drawControl);
    this.map.addLayer(this.editableLayers);

    this.map.on('draw:created', (e) => {
      this.activeTownship = false;
      this.activeSection = false;
      this.activeQuarter = false;
      this.activeCounty = false;
      if (this.mapTownShipExtent && Object.keys(this.mapTownShipExtent).length) {
        this.mapTownShipExtent = {};
      }
      if(this.selectedArea) {
        this.selectedArea.clearLayers();
      }
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
      if (this.infoPointLayers) {
        this.infoPointLayers.clearLayers();
      }
      if(this.selectedArea) {
        this.selectedArea.clearLayers();
      }
      if (this.tablePointLayers) {
        this.tablePointLayers.clearLayers();
      }
      this.mapExtent = [];
      this.apiService.emitMapExtent(this.mapExtent);
    });
    this.map.on('draw:drawstart', (e) => {
      if (this.apiService.isFilterApplied) {
        const dialogRef = this.dialog.open(WarningWindowComponent, {
          data: {
            mesg: 'Your Previous selection will be cleared.',
            btnText: 'OK'
          }
        });
        dialogRef.afterClosed().subscribe(val => {
          this.apiService.loadResetTable(true);
          this.apiService.isFilterApplied = false;
        });
      }
      this.isShapeDrawn = true;
    });
    this.map.on('draw:drawstop', (e) => {
      this.isShapeDrawn = true;
      setTimeout(() => {
        this.isShapeDrawn = false;
      }, 1000);
    });

    this.map.on('overlayadd', (event) => {
      if (event.name == 'Base Map') {
        if(!this.miniMap.hasLayer(this.esriBaseLayer)) {
          this.miniMap.addLayer(this.esriBaseLayer);
        }
    }
    if (event.name == 'Satellite') {
      this.esriImageryLayer = esri.basemapLayer('Imagery');
        if(!this.miniMap.hasLayer(this.esriImageryLayer)) {
          this.miniMap.addLayer(this.esriImageryLayer);
        }
    }
    if (event.name == 'Culture') {
        if(!this.miniMap.hasLayer(this.cultureLayer)) {
          this.miniMap.addLayer(this.cultureLayer);
        }
    }
    if (event.name == 'PLSS') {
        if(!this.miniMap.hasLayer(this.plssLayer)) {
          this.miniMap.addLayer(this.plssLayer);
        }
    }
    if (event.name == 'Wells') {
      if(!this.miniMap.hasLayer(this.wellsLayer)) {
        this.miniMap.addLayer(this.wellsLayer);
      }
      if(!this.map.hasLayer(this.clusterLayer)) {
        if(this.map.getZoom() < 11) {
          this.map.addLayer(this.clusterLayer);
        }
      }
    }
    });
    this.map.on('overlayremove', (event) => {
      if (event.name == 'Base Map') {
          if(this.miniMap.hasLayer(this.esriBaseLayer)) {
            this.miniMap.removeLayer(this.esriBaseLayer);
          }
      }
      if (event.name == 'Satellite') {
          if(this.miniMap.hasLayer(this.esriImageryLayer)) {
            this.miniMap.removeLayer(this.esriImageryLayer);
          }
      }
      if (event.name == 'Culture') {
          if(this.miniMap.hasLayer(this.cultureLayer)) {
            this.miniMap.removeLayer(this.cultureLayer);
          }
      }
      if (event.name == 'PLSS') {
          if(this.miniMap.hasLayer(this.plssLayer)) {
            this.miniMap.removeLayer(this.plssLayer);
          }
      }
      if (event.name == 'Wells') {
        if(this.miniMap.hasLayer(this.wellsLayer)) {
          this.miniMap.removeLayer(this.wellsLayer);
        }
        if(this.map.hasLayer(this.clusterLayer)) {
          this.map.removeLayer(this.clusterLayer);
        }
      }
    });
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
    /* this.plssLayer = L.tileLayer.wms('https://maps.uslandgrid.com/geoserver/landgrid_webmap/wms?', {
      layers: 'landgrid_webmap:LandGrid_WebMap',
      format: 'image/png8',
      transparent: true,
      tiled: false,
      styles: '',
      attribution: null
    });
    this.map.addLayer(this.plssLayer); */
    
    this.plssLayer = wms.source('https://maps.uslandgrid.com/geoserver/landgrid_webmap/wms?', {
      format: 'image/png8',
      transparent: true,
      identify: false
    });
    this.plssLayer.getLayer("landgrid_webmap:LandGrid_WebMap").addTo(this.map);
   
  }

  addWellsLayer() {
    this.wellsLayer = L.tileLayer.wms('https://maps.uslandgrid.com/geoserver/Wells/wms?', {
      layers: 'OKWells',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null
    });
    this.map.addLayer(this.wellsLayer);
  }

  addWellsLayer_1() {
    this.wellsLayer = L.tileLayer.wms('https://maps.uslandgrid.com/geoserver/Wells/wms?', {
      layers: 'OKWells',
      format: 'image/png8',
      transparent: true,
      styles: '',
      attribution: null,
      identify: false
    });
    this.miniMap.addLayer(this.wellsLayer);
  }

  addClusterLayer() {
    //Adding Cluster layer
    this.clusterLayer = L.markerClusterGroup({
      //disableClusteringAtZoom: 8,
      showCoverageOnHover: false,
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
    this.apiService.globalLoader = false;
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
      'Satellite': this.esriImageryLayer

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
    this.filterEmit(true);
  }

  goToLocation(lat, lng) {
    this.map.setView(new L.LatLng(lat, lng), 12);
  }

  goToLocationAlaska(lat, lng) {
    this.map.setView(new L.LatLng(lat, lng), 5);
    this.filterEmit(true);
  }
  showInfoPoint(ev) {
    if (this.activeSection || this.activeTownship || this.activeQuarter || this.activeCounty) {
      
      if(ev.originalEvent.ctrlKey) {
        this.multiSelectPoints.push({
          lon: ev.latlng.lng,
          lat: ev.latlng.lat
        });
        if (this.activeCounty && this.multiSelectPoints && this.multiSelectPoints.length > 5) {
          const dialogRef = this.dialog.open(WarningWindowComponent, {
            data: {
              mesg: 'Only 5 counties allowed per selection',
            },
            disableClose: true
          });
          this.apiService.globalLoader = false;
          this.apiService.hide();
          if(this.numberOfClick >= 5) {
            return;
          }
        };
        if (this.activeTownship && this.multiSelectPoints && this.multiSelectPoints.length > 10) {
          const dialogRef = this.dialog.open(WarningWindowComponent, {
            data: {
              mesg: 'Only 10 townships allowed per selection',
            },
            disableClose: true
          });
          this.apiService.globalLoader = false;
          this.apiService.hide();
          if(this.numberOfClick >= 10) {
            return;
          }
        };
        if ((this.activeQuarter || this.activeSection) && this.multiSelectPoints && this.multiSelectPoints.length > 50) {
          const dialogRef = this.dialog.open(WarningWindowComponent, {
            data: {
              mesg: `Only 50 ${this.activeQuarter ? ' quarters ' : ' sections '} allowed per selection`,
            },
            disableClose: true
          });
          this.apiService.globalLoader = false;
          this.apiService.hide();
          if(this.numberOfClick >= 50) {
            return;
          }
        };
        
      } else {
        this.multiSelectPoints = [{
          lon: ev.latlng.lng,
          lat: ev.latlng.lat
        }];
      }
      let payload = {
        type: this.townshipType,
        plssPoints: this.multiSelectPoints
      }
      const payloadForMarkMap =  {
        plssFilterDto : {
          type: this.townshipType,
          longitude: ev.latlng.lng,
          latitude: ev.latlng.lat
        }
      };

      if (this.activeCounty && this.multiSelectPoints && this.multiSelectPoints.length <= 5) {
        this.apiService.getMarkedMap(payloadForMarkMap).subscribe((res: any) => {
          if (Object.keys(res).length) {
            this.drawOWSLayer(res, ev);
          }
        });
      }
      if (this.activeTownship && this.multiSelectPoints && this.multiSelectPoints.length <= 10) {
        this.apiService.getMarkedMap(payloadForMarkMap).subscribe((res: any) => {
          if (Object.keys(res).length) {
            this.drawOWSLayer(res, ev);
          }
        });
      }
      if ((this.activeQuarter || this.activeSection) && this.multiSelectPoints && this.multiSelectPoints.length <= 50) {
        this.apiService.getMarkedMap(payloadForMarkMap).subscribe((res: any) => {
          if (Object.keys(res).length) {
            this.drawOWSLayer(res, ev);
          }
        });
      }
      
      if (this.activeCounty && this.multiSelectPoints && this.multiSelectPoints.length > 5) { 
        this.multiSelectPoints.pop();
       }
      if (this.activeTownship && this.multiSelectPoints && this.multiSelectPoints.length > 10) { 
        this.multiSelectPoints.pop();
       }
      if ((this.activeQuarter || this.activeSection) && this.multiSelectPoints && this.multiSelectPoints.length > 50) { 
        this.multiSelectPoints.pop();
       }
       setTimeout(() => {
         this.numberOfClick = this.multiSelectPoints.length;
       }, 1000);
      this.mapTownShipExtent = payload;
      this.apiService.emitTownshipExtent(this.mapTownShipExtent);
      this.apiService.globalLoader = true;
      this.infoPointsSubscriber = this.apiService.infoPoint({ plssFilterDto: payload }).subscribe((coords: []) => {
        const circleOptions = {
          color: '#0ff',
          fillColor: '#0ff',
          fillOpacity: 0.0,
          radius: 8,
          weight: 2
        }
        if (this.infoPointLayers) {
          this.infoPointLayers.clearLayers();
        }
        if (this.editableLayers) {
          this.editableLayers.clearLayers();
        }
        let circle = L.featureGroup();
        coords['wellDtos'].forEach((coord) => {
          let circleMarker = L.circleMarker([coord['latitude'], coord['longitude']], circleOptions);
          circle.addLayer(circleMarker);
        })
        this.infoPointLayers.addLayer(circle);
        this.map.addLayer(this.infoPointLayers);
        this.apiService.globalLoader = false;
      },
        (err) => {
          this.apiService.hide();
          this.apiService.globalLoader = false;
        });
    }
    else if (this.map.getZoom() > 11 && !this.isShapeDrawn) {
     this.infoPointsSubscriber = this.apiService.fetchInfoPoint(ev.latlng).subscribe((data: any) => {
        if (data.length) {
          if (this.infoWindowDialog) {
            this.infoWindowDialog.close();
          }
          this.isInfoWindowOpened = true;
          this.infoPointInfo = data;
          this.infoWindowDialog = this.dialog.open(InfoWindowComponent, {
            width: '350px',
            maxWidth: 350,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            hasBackdrop: false,
            data
          });
          this.infoWindowDialog.afterClosed().subscribe((data) => {
            this.infoPointInfo = [];
            this.markWell(null);
            this.isInfoWindowOpened = false;
          });
        }
      },
      (err) => {
        this.apiService.hide();
      });
    }
  }

  filterEmit(event) {
    if (event) {
      this.isMapExtentApplied = true;
      let extent = this.map.getBounds();
      if (this.editableLayers && Object.keys(this.editableLayers._layers).length) {
        console.log(this.editableLayers);
        extent = this.editableLayers.getBounds();
      }
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
      this.mapTownShipExtent = {};
    } else {
      this.isMapExtentApplied = false;
      this.mapExtent = [];
      this.mapTownShipExtent = {};
    }
  }

  filterEmitForShapes(event) {
    if (event) {
      this.isMapExtentApplied = true;
      this.isTownshipIsActive = false;
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
      this.apiService.emitMapExtent(this.mapExtent)
      this.drawInfoPoints(this.mapExtent);
    } else {
      this.isMapExtentApplied = false;
      this.mapExtent = [];
    }

  }

  zoomToEmit(event) {
    this.goToLocation(event[0].latitude, event[0].longitude);
    this.markTableWells(event)
  }

  markTableWells(wells) {
    const circleOptions = {
      color: '#0ff',
      fillColor: '#0ff',
      fillOpacity: 0.0,
      radius: 8,
      weight: 2
    }
    const coords = wells.map(well => ({ latitude: well['latitude'], longitude: well['longitude'] }));
    if (this.tablePointLayers) {
      this.tablePointLayers.clearLayers();
    }
    coords.forEach(coord => {
      let circle = L.circleMarker([coord['latitude'], coord['longitude']], circleOptions);
      this.tablePointLayers.addLayer(circle);
    })
    this.map.addLayer(this.tablePointLayers);
  }

  markTableWelsSelection(wells) {
    const circleOptions = {
      color: '#ffff00',
      fillColor: '#ffff00',
      fillOpacity: 1,
      radius: 6,
      weight: 2
    }
    if (this.infoPointLayers && Object.keys(this.infoPointLayers._layers).length) {
      const coords = wells.map(well => ({ latitude: well['latitude'], longitude: well['longitude'] }));
      if (this.yellowPointLayers) {
        this.yellowPointLayers.clearLayers();
      }
      coords.forEach(coord => {
        let circle = L.circleMarker([coord['latitude'], coord['longitude']], circleOptions);
        this.yellowPointLayers.addLayer(circle);
      })
      this.map.addLayer(this.yellowPointLayers);
      const selectedIds = wells.map(well => well.wellId);
      this.apiService.emitSelectedWellIds(selectedIds);
    }
  }

  clear(event) {
    this.markWell(null);
  }
  refreshEmit(event) {
    // this.mapExtent = [];
  }

  markWell($event) {
    if (!$event) {
      if (this.circleMarker) {
        this.circleMarker.remove();
      }
    } else {
      let { latitude, longitude } = $event;
      // this.goToLocation(latitude, longitude);
      this.circleMarker = L.circleMarker([latitude, longitude], {
        color: '#0ff',
        fillColor: '#0ff',
        fillOpacity: 0.0,
        radius: 8
      }).addTo(this.map);
    }
  }

  clearSearchInput() {
    this.myControl.patchValue('');
  }

  clusterData() {
    setTimeout(() => {
      let clusterPoints = [];
      let extent = this.map.getBounds();
      let circleExtent = this.map.getBounds();
      if (this.editableLayers && Object.keys(this.editableLayers._layers).length) {
        extent = this.editableLayers.getBounds();
      }
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

      if (this.editableLayers && Object.keys(this.editableLayers._layers).length) {
        circleExtent = this.map.getBounds();
        const mapPoint = [{
          lat: circleExtent.getNorthWest().lat,
          lon: circleExtent.getNorthWest().lng
        }, {
          lat: circleExtent._northEast.lat,
          lon: circleExtent._northEast.lng
        }, {
          lat: circleExtent.getSouthEast().lat,
          lon: circleExtent.getSouthEast().lng
        }, {
          lat: circleExtent._southWest.lat,
          lon: circleExtent._southWest.lng
        }, {
          lat: circleExtent.getNorthWest().lat,
          lon: circleExtent.getNorthWest().lng
        }];
        clusterPoints = mapPoint;
        // this.mapExtent = points;
      } else {
        clusterPoints = points;
      }

      if (this.clusterSubcribe) {
        this.clusterSubcribe.unsubscribe();
        if (this.circleGroup) {
          this.map.removeLayer(this.circleGroup);
          this.circleGroup.clearLayers();
        }
        this.drawCircle(clusterPoints);
      } else {
        this.drawCircle(clusterPoints);
      }

    }, 10);

  }

  drawCircle(clusterPoints) {
    var myIcon = L.divIcon({ className: 'my-div-icon' });
    this.clusterSubcribe = this.apiService.cluster({ points: clusterPoints, zoom: this.map.getZoom() }).subscribe(val => {
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
    if (+num.toString() <= 9) {
      return 10;
    }

    if (+num.toString() > 9 && +num.toString() <= 99) {
      return 12;
    }
    if (+num.toString() > 99 && +num.toString() <= 999) {
      return 14;
    }
    if (+num.toString() > 999 && +num.toString() <= 9999) {
      return 16;
    }
    if (+num.toString() > 9999 && +num.toString() <= 25000) {
      return 18;
    }
    if (+num.toString() > 25000 && +num.toString() <= 50000) {
      return 20;
    }
    if (+num.toString() > 50000 && +num.toString() <= 60000) {
      return 22;
    }
    if (+num.toString() > 60000 && +num.toString() <= 75000) {
      return 24;
    }
    if (+num.toString() > 75000 && +num.toString() <= 100000) {
      return 24;
    }
    if (+num.toString() > 100000) {
      return 26;
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
    var circleOptions = {
      color: '#0ff',
      fillColor: '#0ff',
      fillOpacity: 0.0,
      radius: 8,
      weight: 2
    }
    this.apiService.highlighCreteria({ points: data }).subscribe((res: any) => {
      if (res['count'] > 10000) {
        const dialogRef = this.dialog.open(WarningWindowComponent, {
          data: {
            mesg: 'Your Area of Interest has more than 10000 records. Please choose a smaller area.'
          }
        });
        dialogRef.afterClosed().subscribe(val => {
          if (this.editableLayers) {
            this.editableLayers.clearLayers();
          }
          this.mapExtent = [];
          this.apiService.emitMapExtent(this.mapExtent);
        });
      } else {
        this.apiService.globalLoader = true;
        this.apiService.infoPoint({ limit: '', offset: 0, points: data }).subscribe((coords: []) => {
          coords['wellDtos'].forEach(coord => {
            let circle = L.circleMarker([coord['latitude'], coord['longitude']], circleOptions);
            this.infoPointLayers.addLayer(circle);
          })
          this.map.addLayer(this.infoPointLayers);
          this.apiService.globalLoader = false;
        });
      }
    });
  }

  getAllocatedFileTypes() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && Object.keys(userInfo)) {
      let id = userInfo.userId;
      this.apiService.userDetails(id).subscribe(user => {
        this.formats = user['userPermissionDto']['reportTypes'].filter(file => file.length);
      });
    }

  }

  stopCloseDropdown($event) {
    $event.stopPropagation();
  }

  isReadyToExprt() {
    let isDrawCreated;
    if (((this.editableLayers && Object.keys(this.editableLayers._layers).length) ||
      (this.mapTownShipExtent && Object.keys(this.mapTownShipExtent).length)) && this.userService.isloggedin()) {
      isDrawCreated = true;
    } else {
      isDrawCreated = false;
    }
    return isDrawCreated ? false : true;
  }

  exportReport() {
    const payload = {};
    const points = [];
    this.isShapeExporting = true;
    payload['reportType'] = this.reportType;
    if (this.activeTownship || this.activeSection || this.activeQuarter || this.activeCounty) {
      payload['plssFilterDto'] = this.mapTownShipExtent;
    } else {
      payload['points'] = this.mapExtent;
    }
    this.apiService.exportCreteria(payload).subscribe((res: any) => {
      if (res.permission) {
        this.apiService.generateReport(payload).subscribe(res => {
          const extension = this.reportType == 'shp' || this.reportType === 'csv' ? 'zip' : this.reportType;
          const blobCont = new File([res], "Report." + extension, { type: extension });
          saveAs(blobCont);
          this.isShapeExporting = false;
        },
          (err) => {
            this.isShapeExporting = false;
          });
      } else {
        this.isShapeExporting = false;
        const dialogRef = this.dialog.open(WarningWindowComponent, {
          data: {
            mesg: 'You are not allowed to export for selected region, Please contact administrator.'
          }
        });
      }
    });


  }

  generateTownShip(event, type) {
    event.stopPropagation();
    if (this.apiService.isFilterApplied) {
      const dialogRef = this.dialog.open(WarningWindowComponent, {
        data: {
          mesg: 'Do you want to clear previous selection?',
          confirm: true,
        }
      });
      dialogRef.afterClosed().subscribe(val => {
        if (val === 'true') {
          this.apiService.loadResetTable(true);
          this.apiService.isFilterApplied = false;
          this.generateTownShip(event, type);
        }
      });
    } else {
      if (type === 'township') {
        this.activeTownship = !this.activeTownship;
        this.activeSection = false;
        this.activeQuarter = false;
        this.activeCounty = false;
        this.resetTownShipSelection();
      }
      if (type === 'section') {
        this.activeSection = !this.activeSection;
        this.activeTownship = false;
        this.activeQuarter = false;
        this.activeCounty = false;
        this.resetTownShipSelection();
      }
      if (type === 'quarter') {
        this.activeTownship = false;
        this.activeSection = false;
        this.activeQuarter = !this.activeQuarter;
        this.activeCounty = false;
        this.resetTownShipSelection();
      }
      if (type === 'county') {
        this.activeTownship = false;
        this.activeSection = false;
        this.activeQuarter = false;
        this.activeCounty = !this.activeCounty;
        this.resetTownShipSelection();
      }
      this.townshipType = type;
      this.isTownshipIsActive = true;
      if (!this.activeSection && !this.activeTownship && !this.activeQuarter && !this.activeCounty) {
        this.resetTownShipSelection();
      }
    }

  }


  resetTownShipSelection() {
     // this.mapTownShipExtent = {};
     this.multiSelectPoints = [];
     if (this.infoPointLayers) {
       this.infoPointLayers.clearLayers();
     }
     if (this.yellowPointLayers) {
       this.yellowPointLayers.clearLayers();
     }
     if (this.selectedArea) {
       this.selectedArea.clearLayers();
     }
     if (this.infoPointsSubscriber) {
       this.infoPointsSubscriber.unsubscribe();
     }
     if (this.editableLayers && Object.keys(this.editableLayers._layers).length) {
       const mapPoint = this.getShapeExtent();
       this.mapExtent = mapPoint;
     } else {
       this.apiService.loadResetTable(true);
     }
  }

  getShapeExtent() {
    const circleExtent = this.editableLayers.getBounds();
    const mapPoint = [{
      lat: circleExtent.getNorthWest().lat,
      lon: circleExtent.getNorthWest().lng
    }, {
      lat: circleExtent._northEast.lat,
      lon: circleExtent._northEast.lng
    }, {
      lat: circleExtent.getSouthEast().lat,
      lon: circleExtent.getSouthEast().lng
    }, {
      lat: circleExtent._southWest.lat,
      lon: circleExtent._southWest.lng
    }, {
      lat: circleExtent.getNorthWest().lat,
      lon: circleExtent.getNorthWest().lng
    }];
    return mapPoint;
  }

  getMapExtent() {
    const circleExtent = this.map.getBounds();
    const mapPoint = [{
      lat: circleExtent.getNorthWest().lat,
      lon: circleExtent.getNorthWest().lng
    }, {
      lat: circleExtent._northEast.lat,
      lon: circleExtent._northEast.lng
    }, {
      lat: circleExtent.getSouthEast().lat,
      lon: circleExtent.getSouthEast().lng
    }, {
      lat: circleExtent._southWest.lat,
      lon: circleExtent._southWest.lng
    }, {
      lat: circleExtent.getNorthWest().lat,
      lon: circleExtent.getNorthWest().lng
    }];
    return mapPoint;
  }

  tooltipFormator(well) {
      if(!well) { return ''};
      if(well) {
        return ''+ well?.wellId + ' ' + well?.wellName + ' ' + well?.operator; 
      }
  }

  drawOWSLayer(info, event) {
    if(event.originalEvent.ctrlKey)  {
      const layer  = L.geoJson(info);
      this.selectedArea.addLayer(layer);
      this.map.addLayer(this.selectedArea);
    }
    else {
      if(this.selectedArea) {
        this.selectedArea.clearLayers();
      }
      const layer  = L.geoJson(info);
      this.selectedArea.addLayer(layer);
      this.map.addLayer(this.selectedArea);
    }
  }

  
}
