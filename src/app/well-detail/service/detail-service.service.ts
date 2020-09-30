import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  fetchWellDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/${wellId}`);
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
  fetchChartData(): Observable<any> {
    return this.http.get(this.baseUrl + `chart/county`);
  }
  // prasanna
  fetchPtWellDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/pt?wellId=${wellId}`);
  }
  fetchOilProductionChartData(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `chart/oilproduction?wellId=${wellId}`);
  }
  fetchGasProductionChartData(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `chart/gasproduction?wellId=${wellId}`);
  }
  fetchOilProductionZoneChartData(): Observable<any> {
    return this.http.get(this.baseUrl + `chart/oilproductionzone`);
  }
  fetchGasProductionZoneChartData(): Observable<any> {
    return this.http.get(this.baseUrl + `chart/gasproductionzone`);
  }
  fetchOperatorChartData(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `chart/operator?wellId=${wellId}`);
  }
}
