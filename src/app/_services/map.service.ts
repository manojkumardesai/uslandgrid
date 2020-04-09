import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public tiles;
  public cultureLayer;
  public plssLayer;
  public wellsLayer;
  public legend: BehaviorSubject<any[]> = new BehaviorSubject([]);
  constructor() { }

  updateLegends() {
    this.legend.next([]);
  }

}
