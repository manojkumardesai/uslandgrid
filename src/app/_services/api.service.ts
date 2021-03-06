import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { share } from 'rxjs/operators';


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
  savedFormData: any;
  public globalLoader = false;
  filterByMapExtentApplied: boolean = false;


  public checkStateOfFilter = new Subject<any>();
  public townshipSubject = new Subject<any>();
  public isFilterApplied = false;

  mapExtentSubject = new Subject<[]>();
  mapExtentTownshipSubject = new Subject<[]>();
  openAdvanceFilter = new Subject<boolean>();
  filteredSubject = new Subject<{}>();
  filterByMapSubject = new Subject<boolean>();

  resetTableSubject = new Subject<boolean>();
  clearAdvanceFilter = new Subject<boolean>();
  zoomToSubject = new Subject<any>();
  tabpointsSubject = new Subject<boolean>();
  yellowPointsSubject = new Subject<any>();
  selectedWellIdSubject = new Subject<[]>();
  resizeMapSubject = new Subject<boolean>();

  // Emit reports pages zone value chart Data
  zoneChartSubject = new Subject<any>();
  private visible$ = new BehaviorSubject<boolean>(false);

  show() {
    this.visible$.next(true);
  }

  hide() {
    this.visible$.next(false);
  }

  isVisible(): Observable<boolean> {
    return this.visible$.asObservable().pipe(share());
  }

  headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*')
    .set('Cache-Control', ' no-cache').set('Accept', '*/*').set('Accept-Encoding', 'gzip, deflate, br');
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

  createUser(payload) {
    return this.http.post(this.baseUrl + `user/create`, payload);
  }

  getListOfUser() {
    return this.http.get(this.baseUrl + `user/v1/list`);
  }

  search(searchKey) {
    return this.http.get(this.baseUrl + `user/v1/list?offset=0&limit=20&searchKey=${searchKey}`)
  }

  login(info): Observable<any> {

    return this.http.post(this.baseUrl + `user/login`, info, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Cache-Control': 'no-cache'
      }
    });
  }

  forgotPassword(info): Observable<any> {
    return this.http.post(this.baseUrl + 'user/forgetpwd', info, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT',
        'Cache-Control': 'no-cache'
      }
    });
  }

  changePassword(payload): Observable<any> {
    return this.http.post(this.baseUrl + `user/changepwd`, payload);
  }

  activateUser(token) {
    return this.http.post(this.baseUrl + `user/activateuser`, token);
  }

  userDetails(id): Observable<any> {
    return this.http.get(this.baseUrl + `user/${id}`)
  }

  updateUser(payload) {
    return this.http.post(this.baseUrl + 'user/update', payload);
  }

  closeFilter(val: any) {
    this.checkStateOfFilter.next(val);
  }

  cluster(data) {
    return this.http.post(this.baseUrl + 'well/clusterpoint', data)
  }

  infoPoint(data) {
    return this.http.post(this.baseUrl + 'wells/highlight', data)
  }

  highlighCreteria(data) {
    return this.http.post(this.baseUrl + 'well/areacount', data);
  }

  exportCreteria(payload) {
    const payloadData = Object.assign({}, payload);
    delete payloadData.reportType;
    return this.http.post(this.baseUrl + 'report/pointcounty/permission', payloadData);
  }

  wellListIds(payload) {
    return this.http.post(this.baseUrl + 'wellidlist', payload);
  }

  getMarkedMap(payload) {
    return this.http.post(this.baseUrl + 'wells/mapmark', payload);
  }
  emitMapExtent(val) {
    this.mapExtentSubject.next(val);
  }

  emitTownshipExtent(val) {
    this.mapExtentTownshipSubject.next(val);
  }

  emitFilterSubject(val) {
    this.filteredSubject.next(val);
  }

  loadAdvanceFilter(val) {
    this.openAdvanceFilter.next(val);
  }

  loadResetTable(val) {
    this.resetTableSubject.next(val);
  }

  loadTableByMapExtent(val) {
    this.filterByMapSubject.next(val);
  }

  resetAdvanceFilter(val) {
    this.clearAdvanceFilter.next(val);
  }

  loadZoomTo(val) {
    this.zoomToSubject.next(val);
  }

  clearTabPoints(val) {
    this.tabpointsSubject.next(val);
  }

  resizeMap(val) {
    this.resizeMapSubject.next(val);
  }

  emitZoneChartSubject(values) {
    this.zoneChartSubject.next(values);
  }

  emitTableSelection(values) {
    this.yellowPointsSubject.next(values);
  }

  emitSelectedWellIds(ids) {
    this.selectedWellIdSubject.next(ids)
  }
}
