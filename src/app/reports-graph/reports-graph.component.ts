import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartTitleOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { DetailService } from '../well-detail/service/detail-service.service';
import { WellDetailComponent } from '../well-detail/well-detail.component';
import { ApiService } from '../_services/api.service';
import { LoginService } from '../_services/login.service';

@Component({
  selector: 'app-reports-graph',
  templateUrl: './reports-graph.component.html',
  styleUrls: ['./reports-graph.component.scss']
})
export class ReportsGraphComponent implements OnInit {

  barChartData: ChartDataSets[];
  barChartLabels: Label[];
  barChartOptions: ChartOptions;
  barChartColors: Color[];
  barChartLegend: boolean;
  barChartType: ChartType;
  chartTititle: ChartTitleOptions = {
    display: true,
    text: 'Zone Wise Values',
    fontSize: 18
  };
  ZoneValues;
  subscription: any = [];
  @ViewChild(BaseChartDirective) barChart :  BaseChartDirective;
  constructor(public detailService: DetailService,
    public route: ActivatedRoute, public loginService: LoginService, public apiService: ApiService) { }

  ngOnInit(): void {
    let ZoneValues = new WellDetailComponent(this.detailService, this.route, this.loginService, this.apiService);
    ZoneValues.fetchOilProductionZoneDataForChart();

    this.subscription.push(
      this.apiService.zoneChartSubject.subscribe(val => {
        if (val) {
          this.barChartData = val.barChartData;
          this.barChartLabels = val.barChartLabels;
          this.barChartOptions = val.barChartOptions;
          this.barChartColors = val.barChartColors;
          this.barChartLegend = val.barChartLegend;
          this.barChartType = val.barChartType;
          this.barChartOptions.title = this.chartTititle;
        }
      })
    );

    this.subscription.push(
      this.apiService.resizeMapSubject.subscribe(val => {
        if (val) {
          this.barChart.chart.resize();
        }
      })
    );
  }

}
