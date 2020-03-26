import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  fetchWellsData(offset, limit): Observable<any> {
    return this.http.get(`http://mercury:8080/wells?offset=${offset}&limit=${limit}`);
  }
  fetchWellsByPayLoad(payLoad, offset, limit): Observable<any> {
    return this.http.get(`http://mercury:8080/wells?${payLoad.group}=${payLoad.value}&offset=${offset}&limit=${limit}`);
  }
  searchWells(key): Observable<any> {
    return this.http.get(`http://mercury:8080/wells?searchKey=${key}`);
  }
  fetchChartData(): Observable<any> {
    return this.http.get(`http://mercury:8080/chart/county`);
  }
  fetchWellDetails(wellId): Observable<any> {
    return this.http.get(`http://mercury:8080/well/${wellId}`);
  }
  fetchCounties(): Observable<any> {
    return this.http.get(`http://mercury:8080/county`);
  }
  fetchOperators(): Observable<any> {
    return this.http.get(`http://mercury:8080/operator`);
  }
  generateReport(payLoad) {
    // const headers = new HttpHeaders();
    return `http://mercury:8080/report/well?state=Oklahoma&${payLoad.group}=${payLoad.value}&reportType=${payLoad.format}`;
  }
  fetchMcWellDetails(wellId): Observable<any> {
    return this.http.get(`http://mercury:8080/well/mc?wellId=${wellId}`);
  }
  fetchCpWellDetails(wellId): Observable<any> {
    return this.http.get(`http://mercury:8080/well/cp?wellId=${wellId}`);
  }
  fetchFtWellDetails(wellId): Observable<any> {
    return this.http.get(`http://mercury:8080/well/ft?wellId=${wellId}`);
  }
  fetchPfWellDetails(wellId): Observable<any> {
    return this.http.get(`http://mercury:8080/well/pf?wellId=${wellId}`);
  }
  fetchSurveyWellDetails(wellId): Observable<any> {
    return this.http.get(`http://mercury:8080/well/survey?wellId=${wellId}`);
  }
  fetchIpWellDetails(wellId): Observable<any> {
    return this.http.get(`http://mercury:8080/well/ipvolume?wellId=${wellId}`);
  }
}
