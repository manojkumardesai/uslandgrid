import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../_services/login.service';

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
  public wellDetailsMC;
  public wellDetailsCP;
  public wellDetailsPF;
  public wellDetailsFT;
  public wellDetailsSurvey;
  public wellDetailsIp;
  public isLoggedIn = false;

  constructor(public apiService: ApiService,
              public route: ActivatedRoute, public loginService: LoginService) { }

  ngOnInit(): void {
    this.wellId = this.route.snapshot.paramMap.get("id");
    this.loginService.user.subscribe((data) => {
      this.isLoggedIn = data && data.loggedIn ? data.loggedIn  : false;
  });
    if(this.wellId) {
      this.fetchDataForChart();
      this.fetchWellDetail(this.wellId);
      this.fetchMcWellDetail(this.wellId);
      this.fetchCpWellDetail(this.wellId);
      this.fetchPfWellDetail(this.wellId);
      this.fetchFtWellDetail(this.wellId);
      this.fetchIpWellDetail(this.wellId);
      this.fetchSurveyWellDetail(this.wellId);
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

  fetchCpWellDetail(wellId) {
    this.apiService.fetchCpWellDetails(wellId).subscribe((data) => {
      this.wellDetailsCP = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
        return {
            key: res,
            value: innerData[res]
        }
    });
    }); });
  }

  fetchFtWellDetail(wellId) {
    this.apiService.fetchWellDetails(wellId).subscribe((data) => {
      this.wellDetailsFT = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
        return {
            key: res,
            value: innerData[res]
        }
    });
    });
    });
  }

  fetchMcWellDetail(wellId) {
    this.apiService.fetchWellDetails(wellId).subscribe((data) => {
      this.wellDetailsMC= data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
        return {
            key: res,
            value: innerData[res]
        }
    });
    });
    });
  }

  fetchPfWellDetail(wellId) {
    this.apiService.fetchWellDetails(wellId).subscribe((data) => {
      this.wellDetailsPF = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
        return {
            key: res,
            value: innerData[res]
        }
    });
    });
    });
  }

  fetchSurveyWellDetail(wellId) {
    this.apiService.fetchWellDetails(wellId).subscribe((data) => {
      this.wellDetailsSurvey = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
        return {
            key: res,
            value: innerData[res]
        }
    });
    });
    });
  }

  fetchIpWellDetail(wellId) {
    this.apiService.fetchWellDetails(wellId).subscribe((data) => {
      this.wellDetailsIp = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
        return {
            key: res,
            value: innerData[res]
        }
    });
    });
    });
  }

}
