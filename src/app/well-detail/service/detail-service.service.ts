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
  fetchWhWellDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/wh?wellId=${wellId}`);
  }
   fetchPtmaxOilGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptmaxoilgas?wellId=${wellId}`);
  }

  fetchPtminOilDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptminoil?wellId=${wellId}`);
  }
  fetchPtminGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptmingas?wellId=${wellId}`);
  }

  fetchPtmonthlyAvgOilGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptmonthlyavgoilgas?wellId=${wellId}`);
  }

  fetchPtyearlyAvgOilGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptyearlyavgoilgas?wellId=${wellId}`);
  }
  fetchPtmaxyearlyOilGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptmaxyearlyoilgas?wellId=${wellId}`);
  }

  fetchPtminyearlyOilDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptminyearlyoil?wellId=${wellId}`);
  }
  fetchPtminyearlyGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptminyearlygas?wellId=${wellId}`);
  }

  fetchPtfirstmonthOilDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptfirstmonthoil?wellId=${wellId}`);
  }
  fetchPtfirstmonthGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptfirstmonthgas?wellId=${wellId}`);
  }

  fetchPtlastmonthOilDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptlastmonthoil?wellId=${wellId}`);
  }
  fetchPtlastmonthGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptlastmonthgas?wellId=${wellId}`);
  }
  fetchPtmaxproductionDateOilDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptmaxproddateoil?wellId=${wellId}`);
  }
  fetchPtmaxproductionDateGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptmaxproddategas?wellId=${wellId}`);
  }
  fetchPtFirstYearproductionOilGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptfirstyearprodoilgas?wellId=${wellId}`);
  }
  fetchPtLastYearproductionOilGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptlastyearprodoilgas?wellId=${wellId}`);
  }
  fetchPtFirstSixMonthsproductionOilGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptfirstsixmonthsprodoilgas?wellId=${wellId}`);
  }
  fetchPtLastSixMonthsproductionOilGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptlastsixmonthsprodoilgas?wellId=${wellId}`);
  }
  fetchPtCumproductionOilGasDetails(wellId): Observable<any> {
    return this.http.get(this.baseUrl + `well/ptlastcumprodoilgas?wellId=${wellId}`);
  }
}
