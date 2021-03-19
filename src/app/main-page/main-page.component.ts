import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(public apiService: ApiService) { }

  tableHeigh = 30;

  ngOnInit(): void {
  }

  resetMap(event) {
    this.apiService.resizeMap(true);
    this.tableHeigh = event.sizes[1];
  }

}
