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

    //this.tiles.addTo(this.map);


    this.cultureLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/culture1/wms?', {
       layers: 'Culture',
       format: 'image/png8',
       transparent: true,
       styles: '',
       attribution: null
     }).addTo(this.map);


    this.plssLayer = L.tileLayer.wms('http://maps.uslandgrid.com/geoserver/national_plss/wms?', {
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

  additionalMethods() {
    L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({
  
      onAdd: function (map) {
        // Triggered when the layer is added to a map.
        //   Register a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onAdd.call(this, map);
        map.on('click', this.getFeatureInfo, this);
      },
      
      onRemove: function (map) {
        // Triggered when the layer is removed from a map.
        //   Unregister a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onRemove.call(this, map);
        map.off('click', this.getFeatureInfo, this);
      },
      
      getFeatureInfo: function (evt) {
        // Make an AJAX request to the server and hope for the best
        var url = this.getFeatureInfoUrl(evt.latlng),
            showResults = L.Util.bind(this.showGetFeatureInfo, this);
        $.ajax({
          url: url,
          success: function (data, status, xhr) {
            var err = typeof data === 'string' ? null : data;
            showResults(err, evt.latlng, data);
          },
          error: function (xhr, status, error) {
            showResults(error);  
          }
        });
      },
      
      getFeatureInfoUrl: function (latlng) {
        // Construct a GetFeatureInfo request URL given a point
        var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
            size = this._map.getSize(),
            
            params = {
              request: 'GetFeatureInfo',
              service: 'WMS',
              srs: 'EPSG:4326',
              styles: this.wmsParams.styles,
              transparent: this.wmsParams.transparent,
              version: this.wmsParams.version,      
              format: this.wmsParams.format,
              bbox: this._map.getBounds().toBBoxString(),
              height: size.y,
              width: size.x,
              layers: this.wmsParams.layers,
              query_layers: this.wmsParams.layers,
              info_format: 'text/html'
            };
        
        params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
        params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;
        
        return this._url + L.Util.getParamString(params, this._url, true);
      },
      
      showGetFeatureInfo: function (err, latlng, content) {
        if (err) { console.log(err); return; } // do nothing if there's an error
        
        // Otherwise show the content in a popup, or something.
        L.popup({ maxWidth: 800})
          .setLatLng(latlng)
          .setContent(content)
          .openOn(this._map);
      }
    });
    
    L.tileLayer.betterWms = function (url, options) {
      return new L.TileLayer.BetterWMS(url, options);  
    };
  }

 
}
