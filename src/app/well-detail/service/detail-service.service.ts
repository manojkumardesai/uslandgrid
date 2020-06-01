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
}
