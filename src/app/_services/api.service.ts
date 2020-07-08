import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.baseUrl;
  grids: any;
  wells: any = {};
  landGrids: any = {};
  productions: any = {};
  dates: any = {};
  appllyAllCondtions: boolean = true;
  appllyAnyCondtion: boolean = false;
  constructor(private http: HttpClient) { }

  fetchWellsByPayLoad(payLoad, offset, limit): Observable<any> {
    return this.http.get(this.baseUrl + `wells?${payLoad.group}=${payLoad.value}&offset=${offset}&limit=${limit}`);
  }
  fetchWellsData(wellPayLoad): Observable<any> {
    return this.http.post(this.baseUrl + 'wells', wellPayLoad);
  }
  fetchCounties(): Observable<any> {
    return this.http.get(this.baseUrl + `county`);
  }
  fetchOperators(): Observable<any> {
    return this.http.get(this.baseUrl + `operator`);
  }
  fetchClusters(offset, limit): Observable<any> {
    return this.http.get(this.baseUrl + `well/cluster?offset=${offset}&limit=${limit}`);
  }
  generateReport(payLoad) {
    return this.http.post(this.baseUrl + `report/well`, payLoad, { responseType: 'arraybuffer' });
  }
  fetchInfoPoint({ lat, lng }) {
    return this.http.post(this.baseUrl + `well/info`, { latitude: lat, longitude: lng });
  }
  fetchUniqueValues(columnName, tableName) {
    return this.http.get(this.baseUrl + `unique/${columnName}?table=${tableName}`);
  }
  fetchColumnValues(isProd) {
    return this.http.get(this.baseUrl + `filter/column?production=${isProd}`);
  }

  fetchMcWellDetails(payload): Observable<any> {
    return this.http.post(this.baseUrl + `welllist/mc`, payload);
  }
  fetchCpWellDetails(payload): Observable<any> {
    return this.http.post(this.baseUrl + `welllist/cp`, payload);
  }
  fetchFtWellDetails(payload): Observable<any> {
    return this.http.post(this.baseUrl + `welllist/ft`, payload);
  }
  fetchPfWellDetails(payload): Observable<any> {
    return this.http.post(this.baseUrl + `welllist/pf`, payload);
  }
  fetchSurveyWellDetails(payload): Observable<any> {
    return this.http.post(this.baseUrl + `welllist/survey`, payload);
  }
  fetchIpWellDetails(payload): Observable<any> {
    return this.http.post(this.baseUrl + `welllist/ipvolume`, payload);
  }
  fetchColumns(): Observable<any> {
    return this.http.get(this.baseUrl + `group/column`);
  }

  fetchColValues(column, table): Observable<any> {
    return this.http.get(this.baseUrl + `unique/${column}?table=${table}&offset=0&limit=20`);
  }
  fetchSingleColValues(column, table, key): Observable<any> {
    return this.http.get(this.baseUrl + `unique/${column}?table=${table}&offset=0&limit=20&searchKey=${key}`);
  }

  fetchWell(filterDetails) {
    let payload = {};
    payload['reportType'] = 'shp';
    payload['filters'] = {};
    payload['filters']['operator'] = 'and';
    payload['filters']['exp'] = filterDetails;
    return this.http.post(this.baseUrl + `report/well`, payload)
  }
}
