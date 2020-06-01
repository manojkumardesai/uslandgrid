import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.baseUrl;

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
  fetchClusters(): Observable<any> {
    return this.http.get(this.baseUrl + `well/cluster`);
  }
  generateReport(payLoad) {
    return this.http.post(this.baseUrl + `report/well`, payLoad, { responseType: 'arraybuffer' });
  }
  fetchInfoPoint({ lat, lng }) {
    return this.http.post(this.baseUrl + `well/info`, { latitude: lat, longitude: lng });
  }
  fetchUniqueValues(columnName) {
    return this.http.get(this.baseUrl + `unique/${columnName}`);
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
}
