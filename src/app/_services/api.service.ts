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
  fetchChartData(): Observable<any> {
    return this.http.get(this.baseUrl + `chart/county`);
  }
  fetchWellDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/${wellId}`);
  }
  fetchCounties(): Observable<any> {
    return this.http.get(this.baseUrl + `county`);
  }
  fetchOperators(): Observable<any> {
    return this.http.get(this.baseUrl + `operator`);
  }
  // generateReport(payLoad) {
  //   // const headers = new HttpHeaders();
  //   return this.baseUrl + `report/well?state=Oklahoma&${payLoad.group}=${payLoad.value}&reportType=${payLoad.format}`;
  // }
  generateReport(payLoad) {
    // const headers = new HttpHeaders();
    return this.http.post(this.baseUrl + `report/well`, payLoad, { responseType: 'arraybuffer' });
  }
  fetchMcWellDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/mc?wellId=${wellId}`);
  }
  fetchCpWellDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/cp?wellId=${wellId}`);
  }
  fetchFtWellDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ft?wellId=${wellId}`);
  }
  fetchPfWellDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/pf?wellId=${wellId}`);
  }
  fetchSurveyWellDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/survey?wellId=${wellId}`);
  }
  fetchIpWellDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ipvolume?wellId=${wellId}`);
  }
  fetchInfoPoint({ lat, lng }) {
    return this.http.post(this.baseUrl + `well/info`, { latitude: lat, longitude: lng });
  }
  fetchUniqueValues(columnName) {
    return this.http.get(this.baseUrl + `unique/${columnName}`);
  }
}
