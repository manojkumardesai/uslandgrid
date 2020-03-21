import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-well-detail',
  templateUrl: './well-detail.component.html',
  styleUrls: ['./well-detail.component.scss']
})
export class WellDetailComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
    showLines: false,
    legend: {position: 'bottom'}
  };
  public doughNutChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
    showLines: false,
    legend: {position: 'bottom'}
  };

  public barChartData: ChartDataSets[];
  public doughNutChartData;
  public barChartLabels: Label[];
  public barChartLegend = true;
  public barChartType: ChartType = 'bar';
  public doughNutChartType: ChartType = 'doughnut';
  public chartReady = false;
  public wellId;
  public wellDetails;

  constructor(public apiService: ApiService,
              public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.wellId = this.route.snapshot.paramMap.get("id");
    if(this.wellId) {
      this.fetchDataForChart();
      this.fetchWellDetail(this.wellId);
    }
  }

  fetchDataForChart() {
    this.apiService.fetchChartData().subscribe((data) => {
      this.barChartLabels = data.map((res) => {
        return res.county
      });
      let values =  data.map((res) => {
        return res.value
      });
      this.doughNutChartData = values;
      this.barChartData = [{
        data: values,
        label: 'Wells A'
      }];
      this.chartReady = true;
    });
  }

  fetchWellDetail(wellId) {
    this.apiService.fetchWellDetails(wellId).subscribe((data) => {
      this.wellDetails = data;
    });
  }

}
