import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../_services/login.service';
import { DetailService } from './service/detail-service.service';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-well-detail',
  templateUrl: './well-detail.component.html',
  styleUrls: ['./well-detail.component.scss']
})
export class WellDetailComponent implements OnInit {

  public chartReady = false;
  public wellId;
  public wellDetails;
  public wellDetailsMC = [];
  public wellDetailsCP = [];
  public wellDetailsPF = [];
  public wellDetailsFT = [];
  public wellDetailsSurvey = [];
  public wellDetailsIP = [];
  public wellDetailsPT = [];
  public isLoggedIn = false;
  public oilLow: number;
  // private _apiservice: ApiService;
  
  constructor(public detailService: DetailService,
    public route: ActivatedRoute, public loginService: LoginService) { }

  ngOnInit(): void {
    this.wellId = this.route.snapshot.paramMap.get("id");
    let user = JSON.parse(sessionStorage.getItem('userInfo'));
    this.isLoggedIn = user && Object.keys(user).length ? true : false; 
   
    if (this.wellId) {
      this.fetchWellDetail(this.wellId);
      this.fetchMcWellDetail(this.wellId);
      this.fetchCpWellDetail(this.wellId);
      this.fetchPfWellDetail(this.wellId);
      this.fetchFtWellDetail(this.wellId);
      this.fetchIpWellDetail(this.wellId);
      this.fetchSurveyWellDetail(this.wellId);
      this.fetchPtWellDetail(this.wellId);
      this.fetchOilProductionDataForChart(this.wellId);
      this.fetchOilProductionZoneDataForChart();
      // this.fetchOperatorDataForChart(this.wellId);
    }
  
  }

  // for api number in the url
  substr() {
    let sub = this.wellId.substring(2, 10);
    return sub;
  }
  // //OIl 
  oilValue() {
    this.oilLow = 50;
    document.getElementById("demohigh").style.backgroundColor = "#33a02c";
    document.getElementById("demolow").style.backgroundColor = "#33a02c";
    document.getElementById("demoavgmonth").style.backgroundColor = "#33a02c";
    document.getElementById("demoavgyear").style.backgroundColor = "#33a02c";
    document.getElementById("demominmonth").style.backgroundColor = "#33a02c";
    document.getElementById("demomaxmonth").style.backgroundColor = "#33a02c";
    document.getElementById("demominyear").style.backgroundColor = "#33a02c";
    document.getElementById("demomaxyear").style.backgroundColor = "#33a02c";
    document.getElementById("demofirstmonth").style.backgroundColor = "#33a02c";
    document.getElementById("demolastmonth").style.backgroundColor = "#33a02c";
    document.getElementById("high").innerHTML = String(this.oilLow);
    document.getElementById("low").innerText = String(5);
    document.getElementById("avgmonth").innerText = String(200);
    document.getElementById("avgyear").innerText = String(1000);
    document.getElementById("minmonth").innerText = String(17);
    document.getElementById("maxmonth").innerText = String(190);
    document.getElementById("minyear").innerText = String(990);
    document.getElementById("maxyear").innerText = String(1200);
    document.getElementById("firstmonth").innerText = String(990);
    document.getElementById("lastmonth").innerText = String(1200);
  }
   //Gas
  gasValue() {
    document.getElementById("demohigh").style.backgroundColor = "#F93C3D";
    document.getElementById("demolow").style.backgroundColor = "#F93C3D";
    document.getElementById("demoavgmonth").style.backgroundColor = "#F93C3D";
    document.getElementById("demoavgyear").style.backgroundColor = "#F93C3D";
    document.getElementById("demominmonth").style.backgroundColor = "#F93C3D";
    document.getElementById("demomaxmonth").style.backgroundColor = "#F93C3D";
    document.getElementById("demominyear").style.backgroundColor = "#F93C3D";
    document.getElementById("demomaxyear").style.backgroundColor = "#F93C3D";
    document.getElementById("demofirstmonth").style.backgroundColor = "#F93C3D";
    document.getElementById("demolastmonth").style.backgroundColor = "#F93C3D";
    document.getElementById("high").innerText = String(500);
    document.getElementById("low").innerText = String(50);
    document.getElementById("avgmonth").innerText = String(1000);
    document.getElementById("avgyear").innerText = String(5000);
    document.getElementById("minmonth").innerText = String(800);
    document.getElementById("maxmonth").innerText = String(980);
    document.getElementById("minyear").innerText = String(4000);
    document.getElementById("maxyear").innerText = String(4900);
    document.getElementById("firstmonth").innerText = String(1990);
    document.getElementById("lastmonth").innerText = String(2200);
  }

  //Fields for all layers
  CPheaders = ["Well ID", "Observation Number", "Completion Type", "Date", "Completed Formation",
    "Top Depth", "Base Depth", "Top Formation", "Base Formation", "Remarks"];
  MCheaders = ["Well ID", "Casing ID", "Casing Size","Casing Type", "Top Depth", "Base Depth", "Top Formation", "Base Formation",  "Nominal Weight",
    "Grade","Inside Diameter","Cement Type", "Cement Amount", "Cement Weight", "Hole Size","Top Of Cement","Remarks", "Thread Type", "Manufacturer", "Multistage Depth", 
     "Slurry Volume", "Connect Code", "Install Date", "Leak Off Test", "Pressure Test","Create Date", "Create User Id", "Update User Id", "Update Date",  "Feet", "PSI", "SAX", "Data Source","Record ID (MC)"];
  IPheaders = ["Well ID", "Test Number", "Top Depth", "Base Depth", "Top Formation","Test Date","Oil Volume", "Gas Volume",
  "Water Volume","Choke", "Test Duration", "Base Formation","Oil Rate", "Gas Rate",  "Water Rate",
    "Flow Pressure", "BH Pressure",  "BH Temperature", "Oil Gravity", "H2S", "CO2", "Remarks", "Gas Depth", "Gas Type", "Row Number"];
  PFheaders = ["Well ID","Completion Observation Number", "Perforation Observation Number", "Top Depth", "Base Depth", "Top Formation","Date", "Remarks",  "Base Formation", "Type", "Density", "Diameter",
    "Phase", "Angle", "Count", "Current Status", "Source"];
  STheaders = ["Well ID","Survey Point Number", "MD", "TVD", "Inclination", "Azimuth", "NS_OffSet", "ES_OffSet", "Latitude", "Longitude"];
  FTheaders = ["Well ID","Observation Number", "Formation", "Top MD","Base MD", "Top TVD", "Remarks","Source","Base TVD","Show","Net Thickness","Porosity","Faulted","Eroded","Dip Azimuth","Dip","Confidence","Qualifier","Gap Thickness","FormationCode", "Temp1"];
  PTheaders = ["Well ID", "Date", "Zone", "Activity Type", "Oil", "Gas", "Water", "CO2", "Injection", "Nitrogen", "NGL", "Sulphur",
    "Allocation Factor", "Days On"];

  public barChartData: ChartDataSets[];
  public doughNutChartData;
  public barChartLabels: Label[];
  public doughNutChartLabels:Label[];
  public barChartLegend = false;
  public doughNutChartLegend = false;
  public barChartType: ChartType;
  public doughNutChartType: ChartType = 'doughnut';
  // lineChart
  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  public lineChartLegend = true;
  public lineChartPlugins = [];
  public lineChartType: ChartType = 'line';
  public doughNutChartOptions:ChartOptions={};
  public title;
  public linetitle;
  public operatortitle;

 
  public lineChartOptions:ChartOptions = {
    scales: {
      xAxes: [{
        gridLines: { drawOnChartArea: false, lineWidth: 5 },
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Year'
        },
        ticks: {
          major: {
            fontStyle: 'bold',
            fontColor: '#FF0000'
          }
        }
      }],
      yAxes: [{
        gridLines: { drawOnChartArea: false, lineWidth: 5 },
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Oil Production (BBL/Year)'
        }
      }]
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
    showLines: true,
    legend: { position: 'bottom' }
  };

  public lineChartColors:Color[] = [
    {
      borderColor: '#39e600',
      borderWidth: 3,
      // backgroundColor: 'transparent',
      pointBackgroundColor: 'blue',
      pointBorderColor: 'blue',
      pointBorderWidth: 3
    }
  ];

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        gridLines: { drawOnChartArea: false, lineWidth: 5 },
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Zone'
        },
        ticks: {
          major: {
            fontStyle: 'bold',
            fontColor: '#FF0000',
          },
          // stepSize:10
        }
      }], yAxes: [{
        gridLines: { drawOnChartArea: false, lineWidth: 5 },
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Total Oil Values'
        },
        ticks: {
          major: {
            fontStyle: 'bold',
            fontColor: '#FF0000'
          }
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
    showLines: false,
    legend: { position: 'bottom', }
  };

  public barChartColors: Color[] = [{
     borderColor: '#0000cc',
    backgroundColor: '#33a02c' 
  }]; 


  fetchWellDetail(wellId) {
    this.detailService.fetchWellDetails(wellId).subscribe((data) => {
      this.wellDetails = data;
    });
  }

  fetchCpWellDetail(wellId) {
    this.detailService.fetchCpWellDetails(wellId).subscribe((data) => {
      this.wellDetailsCP = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
          return {
            key: res,
            value: innerData[res]
          }
        });
      });//console.log("CP:",this.wellDetailsCP);
    });
  }

  fetchFtWellDetail(wellId) {
    this.detailService.fetchFtWellDetails(wellId).subscribe((data) => {
      this.wellDetailsFT = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
          return {
            key: res,
            value: innerData[res]
          }
        });
      });//console.log("FT:",this.wellDetailsFT);
    });
  }

  fetchMcWellDetail(wellId) {
    this.detailService.fetchMcWellDetails(wellId).subscribe((data) => {
      this.wellDetailsMC = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
          return {
            key: res,
            value: innerData[res]
          }
        });
      });//console.log("MC:",this.wellDetailsMC);
    });
  }

  fetchPfWellDetail(wellId) {
    this.detailService.fetchPfWellDetails(wellId).subscribe((data) => {
      this.wellDetailsPF = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
          return {
            key: res,
            value: innerData[res]
          }
        });
      });//console.log("PF:",this.wellDetailsPF);
    });
  }

  fetchSurveyWellDetail(wellId) {
    this.detailService.fetchSurveyWellDetails(wellId).subscribe((data) => {
      this.wellDetailsSurvey = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
          return {
            key: res,
            value: innerData[res]
          }
        });
      });//console.log("ST:",this.wellDetailsSurvey);
    });
  }

  fetchIpWellDetail(wellId) {
    this.detailService.fetchIpWellDetails(wellId).subscribe((data) => {
      this.wellDetailsIP = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
          return {
            key: res,
            value: innerData[res]
          }
        });
      });//console.log("IP:",this.wellDetailsIP);
    });
  }

  fetchPtWellDetail(wellId) {
    this.detailService.fetchPtWellDetails(wellId).subscribe((data) => {
      this.wellDetailsPT = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
          return {
            key: res,
            value: innerData[res]
          }
        });
      }); //console.log("PT:",this.wellDetailsPT);
    });
  }

  fetchOilProductionDataForChart(wellId) {
    this.detailService.fetchOilProductionChartData(wellId).subscribe((data) => {
      this.lineChartLabels = data.map((res) => {
        return res.date
      });
      let oilvalues = data.map((res) => {
        return res.oil
      });
      this.lineChartData = [{
        data: oilvalues,
        label: 'Oil',
        fill: false
      }];
      this.lineChartOptions = {
        scales: {
          xAxes: [{
            gridLines: { drawOnChartArea: false, lineWidth: 5 },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Year'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          }],
          yAxes: [{
            gridLines: { drawOnChartArea: false, lineWidth: 5 },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Oil Production (BBL/Year)'
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
          }
        },
        showLines: true,
        legend: { position: 'bottom' }
      };
      this.lineChartColors = [
        {
          borderColor: '#39e600',
          borderWidth: 3,
          // backgroundColor: 'transparent',
          pointBackgroundColor: 'blue',
          pointBorderColor: 'blue',
          pointBorderWidth: 3
        },
      ];
      this.linetitle='Well Production';
      this.chartReady = true;
    });
  }

  fetchGasProductionDataForChart(wellId) {
    this.detailService.fetchGasProductionChartData(wellId).subscribe((data) => {
      this.lineChartLabels = data.map((res) => {
        return res.date
      });
      let gasvalues = data.map((res) => {
        return res.gas
      });
      this.lineChartData = [{
        data: gasvalues,
        label: 'Gas',
        fill: false
      }];
      this.lineChartOptions  = {
        scales: {
          xAxes: [{
            gridLines: { drawOnChartArea: false, lineWidth: 5 },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Year'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          }],
          yAxes: [{
            gridLines: { drawOnChartArea: false, lineWidth: 5 },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Gas Production (MCF/Year)'
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
          }
        },
        showLines: true,
        legend: { position: 'bottom' }
      };
      this.lineChartColors= [
        {
          borderColor: '#F93C3D',
          borderWidth: 3,
          // backgroundColor: 'transparent',
          pointBackgroundColor: 'blue',
          pointBorderColor: 'blue',
          pointBorderWidth: 3
        },
      ];
      this.chartReady = true;
    });  
  }

  oilProduction(){
    this.linetitle='Well Production';
    this.fetchOilProductionDataForChart(this.wellId);
  }

  gasProduction(){
    this.linetitle='Well Production';
  this.fetchGasProductionDataForChart(this.wellId);
  }

  fetchOilProductionZoneDataForChart(){
    this.detailService.fetchOilProductionZoneChartData().subscribe((data) => {
      this.barChartLabels = data.map((res) => {
        return res.zone
      });
      let sumvalue = data.map((res) => {
        return res.sum
      });
      this.barChartData = [{
        data: sumvalue,
        label: 'Oil Production Zone',
      }];
      this.barChartOptions= {
        responsive: true,
        maintainAspectRatio: false,
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
          xAxes: [{
            gridLines: { drawOnChartArea: false, lineWidth: 5 },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Zone'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000',
              },
              // stepSize:10
            }
          }], yAxes: [{
            gridLines: { drawOnChartArea: false, lineWidth: 5 },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Total Oil Value'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          }]
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
          }
        },
        showLines: false,
        legend: { position: 'bottom', }
      };
      this.barChartColors =[{borderColor: '#0000cc', backgroundColor: '#33a02c'}];
      this.barChartType ='bar';
      this.barChartLegend=true;
      this.title='Zone Wise Values';
      this.chartReady = true;
    });
  }

  fetchGasProductionZoneDataForChart(){
    this.detailService.fetchGasProductionZoneChartData().subscribe((data) => {
      this.barChartLabels = data.map((res) => {
        return res.zone
      });
      let sumvalue = data.map((res) => {
        return res.sum
      });
      this.barChartData = [{
        data: sumvalue,
        label: 'Gas Production Zone',
      }];
      this.barChartOptions= {
        responsive: true,
        maintainAspectRatio: false,
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
          xAxes: [{
            gridLines: { drawOnChartArea: false, lineWidth: 5 },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Zone'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000',
              },
              // stepSize:10
            }
          }], yAxes: [{
            gridLines: { drawOnChartArea: false, lineWidth: 5 },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Total Gas Value'
            },
            ticks: {
              major: {
                fontStyle: 'bold',
                fontColor: '#FF0000'
              }
            }
          }]
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'end',
          }
        },
        showLines: false,
        legend: { position: 'bottom', }
      };
      this.barChartColors =[{borderColor: '#0000cc', backgroundColor: '#F93C3D'}];
      this.barChartType ='bar';
      this.barChartLegend=true;
      this.chartReady = true;
    });
  }

  oilProductionzone(){
    this.title='Zone Wise Values';
    this.fetchOilProductionZoneDataForChart();
  }

  gasProductionzone(){
    this.title='Zone Wise Values';
    this.fetchGasProductionZoneDataForChart();
  }

  fetchOperatorDataForChart(wellId){
    this.detailService.fetchOperatorChartData(wellId).subscribe((data) => {
      this.doughNutChartLabels = data.map((res) => {
        return res.operator
      });
      let countvalue = data.map((res) => {
        return res.count
      });
      // this.doughNutChartData = countvalue;
      // this.title='County Operators';
      this.doughNutChartOptions = {
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
        legend: { position: 'right' }
      };
      this.doughNutChartData = [{
        data: countvalue,
        label: 'County',
      }];
      
      this.chartReady = true;
    });
   }

   operator(){
     this.operatortitle='County Operators';
    this.fetchOperatorDataForChart(this.wellId);
   }
}
