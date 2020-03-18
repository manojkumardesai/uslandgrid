import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-well-detail',
  templateUrl: './well-detail.component.html',
  styleUrls: ['./well-detail.component.scss']
})
export class WellDetailComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
  };

  public barChartData: ChartDataSets[] ;
  public barChartLabels: Label[];
  public barChartLegend = true;
  public barChartType: ChartType = 'bar';
  public chartReady = false;

  constructor(public apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchDataForChart();
  }

  fetchDataForChart() {
    this.apiService.fetchChartData().subscribe((data) => {
      this.barChartLabels = data.map((res) => {
        return res.county
      });
      let values =  data.map((res) => {
        return res.value
      });
      this.barChartData = [{
        data: values,
        label: 'Wells A'
      }];
      this.chartReady = true;
    });
  }

}
