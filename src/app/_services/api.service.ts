import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  fetchWellsData(offset, limit): Observable<any> {
    return this.http.get(`http://mercury:8080/wells?offset=${offset}&limit=${limit}`);
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
  generateReport(payLoad): Observable<any> {
    return this.http.get(`http://mercury:8080/report/well?state=Oklahoma&${payLoad.group}=${payLoad.value}&reportType=${payLoad.format}&`);
  }
}
