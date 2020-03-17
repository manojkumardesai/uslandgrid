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
}
