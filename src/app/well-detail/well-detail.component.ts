import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label, ThemeService } from 'ng2-charts';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../_services/login.service';
import { DetailService } from './service/detail-service.service';
import { Chart } from 'chart.js';
import { isNgTemplate } from '@angular/compiler';
// import { GaugeChartModule } from 'angular-gauge-chart'

@Component({
  selector: 'app-well-detail',
  templateUrl: './well-detail.component.html',
  styleUrls: ['./well-detail.component.scss']
})
export class WellDetailComponent implements OnInit {

  public chartReady = false;
  public wellId;
  public wellDetails;
  public wellDetailsWH = [];
  public wellDetailsMC = [];
  public wellDetailsCP = [];
  public wellDetailsPF = [];
  public wellDetailsFT = [];
  public wellDetailsSurvey = [];
  public wellDetailsIP = [];
  public wellDetailsPT = [];
  public isLoggedIn = false;
  public hideTableWH = true;
  public hideTableMC = false;
  public hideTableIP = false;
  public hideTableCP = false;
  public hideTableFT = false;
  public hideTablePF = false;
  public hideTableST = false;
  public hideTablePT = false;
  public hideTableWH1 = true;
  public hideTableMC1 = false;
  public hideTableIP1 = false;
  public hideTableCP1 = false;
  public hideTableFT1 = false;
  public hideTablePF1 = false;
  public hideTableST1 = false;
  public hideTablePT1 = false;
  public hideTableWH2 = true;
  public hideTableMC2 = false;
  public hideTableIP2 = false;
  public hideTableCP2 = false;
  public hideTableFT2 = false;
  public hideTablePF2 = false;
  public hideTableST2 = false;
  public hideTablePT2 = false;
  // public wellsList: any;
  public xaxisHover: any;
  public maxoilvalue: String;
  public minoilvalue: String;
  public maxgasvalue: String;
  public mingasvalue: String;
  public monthlyavgoilvalue: String;
  public monthlyavggasvalue: String;
  public yearlyavgoilvalue: String;
  public yearlyavggasvalue: String;
  public maxyearlyoilvalue: String;
  public maxyearlygasvalue: String;
  public minyearlyoilvalue: String;
  public minyearlygasvalue: String;
  public firstmonthoilvalue: String;
  public firstmonthgasvalue: String;
  public lastmonthoilvalue: String;
  public lastmonthgasvalue: String;
  public oilmaxproddate: String;
  public gasmaxproddate: String;
  public firstyrprodoil: String;
  public firstyrprodgas: String;
  public lastyrprodoil: String;
  public lastyrprodgas: String;
  public firstsixmonprodoil: String;
  public firstsixmonprodgas: String;
  public lastsixmonprodoil: String;
  public lastsixmonprodgas: String;
  public cumprodoil: String;
  public cumprodgas: String;
  // public ptMaxoilGasDetails = [];
  lineChartColors: {
    borderColor: string; borderWidth: number;
    // backgroundColor: 'transparent',
    pointBackgroundColor: string; pointBorderColor: string; pointBorderWidth: number;
  }[];



  constructor(public detailService: DetailService,
    public route: ActivatedRoute, public loginService: LoginService, public _apiservice: ApiService) { }

  ngOnInit(): void {
    this.wellId = this.route.snapshot.paramMap.get("id");
    let user = JSON.parse(localStorage.getItem('userInfo'));
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
      this.fetchWhWellDetail(this.wellId);
      this.fetchPtmaxOilGas(this.wellId);
      this.fetchPtminOil(this.wellId);
      this.fetchPtminGas(this.wellId);
      this.fetchPtmonthlyAvgOilGas(this.wellId);
      this.fetchPtyearlyAvgOilGas(this.wellId);
      this.fetchPtmaxyearlyOilGas(this.wellId);
      this.fetchPtminyearlyOil(this.wellId);
      this.fetchPtminyearlyGas(this.wellId);
      this.fetchPtfirstmonthOil(this.wellId);
      this.fetchPtfirstmonthGas(this.wellId);
      this.fetchPtlastmonthOil(this.wellId);
      this.fetchPtlastmonthGas(this.wellId);
      this.fetchPtmaxproductionDateOil(this.wellId);
      this.fetchPtmaxproductionDateGas(this.wellId);
      this.fetchPtFirstYearproductionOilGas(this.wellId);
      this.fetchPtLastYearproductionOilGas(this.wellId);
      this.fetchPtFirstSixMonthsproductionOilGas(this.wellId);
      this.fetchPtLastSixMonthsproductionOilGas(this.wellId);
      this.fetchPtCumproductionOilGas(this.wellId);
      // this.fetchWellsHighlightListforOil();
      // this.fetchHighlightWellsAvgOilGraph();
    }
  }


  // for api number in the url
  substr() {
    let sub = this.wellId.substring(2, 10);
    return sub;
  }
  // //OIl 
  oilValue() {
    document.getElementById("demohigh").style.backgroundColor = "#33a02c";
    document.getElementById("demolow").style.backgroundColor = "#33a02c";
    document.getElementById("demoavgmonth").style.backgroundColor = "#33a02c";
    document.getElementById("demoavgyear").style.backgroundColor = "#33a02c";
    // document.getElementById("demominmonth").style.backgroundColor = "#33a02c";
    // document.getElementById("demomaxmonth").style.backgroundColor = "#33a02c";
    document.getElementById("demominyear").style.backgroundColor = "#33a02c";
    document.getElementById("demomaxyear").style.backgroundColor = "#33a02c";
    document.getElementById("demofirstmonth").style.backgroundColor = "#33a02c";
    document.getElementById("demolastmonth").style.backgroundColor = "#33a02c";
    document.getElementById("high").innerHTML = String(this.maxoilvalue);
    document.getElementById("low").innerText = String(this.minoilvalue);
    document.getElementById("avgmonth").innerText = String(this.monthlyavgoilvalue);
    document.getElementById("avgyear").innerText = String(this.yearlyavgoilvalue);
    // document.getElementById("minmonth").innerText = String(17);
    // document.getElementById("maxmonth").innerText = String(190);
    document.getElementById("minyear").innerText = String(this.minyearlyoilvalue);
    document.getElementById("maxyear").innerText = String(this.maxyearlyoilvalue);
    document.getElementById("firstmonth").innerText = String(this.firstmonthoilvalue);
    document.getElementById("lastmonth").innerText = String(this.lastmonthoilvalue);

    document.getElementById("primaryprod").innerText = "Oil";
    document.getElementById("maxproddate").innerText = String(this.oilmaxproddate);
    document.getElementById("firstyearprod").innerText = String(this.firstyrprodoil);
    document.getElementById("lastyearprod").innerText = String(this.lastyrprodoil);
    document.getElementById("firstsixmonthsprod").innerText = String(this.firstsixmonprodoil);
    document.getElementById("lastsixmonthsprod").innerText = String(this.lastsixmonprodoil);
    document.getElementById("cumm_prod").innerText = String(this.cumprodoil);
  }
  //Gas
  gasValue() {
    document.getElementById("demohigh").style.backgroundColor = "#F93C3D";
    document.getElementById("demolow").style.backgroundColor = "#F93C3D";
    document.getElementById("demoavgmonth").style.backgroundColor = "#F93C3D";
    document.getElementById("demoavgyear").style.backgroundColor = "#F93C3D";
    // document.getElementById("demominmonth").style.backgroundColor = "#F93C3D";
    // document.getElementById("demomaxmonth").style.backgroundColor = "#F93C3D";
    document.getElementById("demominyear").style.backgroundColor = "#F93C3D";
    document.getElementById("demomaxyear").style.backgroundColor = "#F93C3D";
    document.getElementById("demofirstmonth").style.backgroundColor = "#F93C3D";
    document.getElementById("demolastmonth").style.backgroundColor = "#F93C3D";
    document.getElementById("high").innerText = String(this.maxgasvalue);
    document.getElementById("low").innerText = String(this.mingasvalue);
    document.getElementById("avgmonth").innerText = String(this.monthlyavggasvalue);
    document.getElementById("avgyear").innerText = String(this.yearlyavggasvalue);
    // document.getElementById("minmonth").innerText = String(800);
    // document.getElementById("maxmonth").innerText = String(980);
    document.getElementById("minyear").innerText = String(this.minyearlygasvalue);
    document.getElementById("maxyear").innerText = String(this.maxyearlygasvalue);
    document.getElementById("firstmonth").innerText = String(this.firstmonthgasvalue);
    document.getElementById("lastmonth").innerText = String(this.lastmonthgasvalue);

    document.getElementById("primaryprod").innerText = "Gas";
    document.getElementById("maxproddate").innerText = String(this.gasmaxproddate);
    document.getElementById("firstyearprod").innerText = String(this.firstyrprodgas);
    document.getElementById("lastyearprod").innerText = String(this.lastyrprodgas);
    document.getElementById("firstsixmonthsprod").innerText = String(this.firstsixmonprodgas);
    document.getElementById("lastsixmonthsprod").innerText = String(this.lastsixmonprodgas);
    document.getElementById("cumm_prod").innerText = String(this.cumprodgas);
  }

  //Fields for all layers
  CPheaders = ["Well ID", "Observation Number", "Completion Type", "Date", "Completed Formation",
    "Top Depth", "Base Depth", "Top Formation", "Base Formation", "Remarks"];
  MCheaders = ["Well ID", "Casing ID", "Casing Size", "Casing Type", "Top Depth", "Base Depth", "Top Formation", "Base Formation", "Nominal Weight",
    "Grade", "Inside Diameter", "Cement Type", "Cement Amount", "Cement Weight", "Hole Size", "Top Of Cement", "Remarks", "Thread Type", "Manufacturer", "Multistage Depth",
    "Slurry Volume", "Connect Code", "Install Date", "Leak Off Test", "Pressure Test", "Create Date", "Create User Id", "Update User Id", "Update Date", "Feet", "PSI", "SAX", "Data Source", "Record ID (MC)"];
  IPheaders = ["Well ID", "Test Number", "Top Depth", "Base Depth", "Top Formation", "Test Date", "Oil Volume", "Gas Volume",
    "Water Volume", "Choke", "Test Duration", "Base Formation", "Oil Rate", "Gas Rate", "Water Rate",
    "Flow Pressure", "BH Pressure", "BH Temperature", "Oil Gravity", "H2S", "CO2", "Remarks", "Gas Depth", "Gas Type", "Row Number"];
  PFheaders = ["Well ID", "Completion Observation Number", "Perforation Observation Number", "Top Depth", "Base Depth", "Top Formation", "Date", "Remarks", "Base Formation", "Type", "Density", "Diameter",
    "Phase", "Angle", "Count", "Current Status", "Source"];
  STheaders = ["Well ID", "Survey Point Number", "MD", "TVD", "Inclination", "Azimuth", "NS_OffSet", "ES_OffSet", "Latitude", "Longitude"];
  FTheaders = ["Well ID", "Observation Number", "Formation", "Top MD", "Base MD", "Top TVD", "Remarks", "Source", "Base TVD", "Show", "Net Thickness", "Porosity", "Faulted", "Eroded", "Dip Azimuth", "Dip", "Confidence", "Qualifier", "Gap Thickness", "FormationCode", "Temp1"];
  PTheaders = ["Well ID", "Date", "Zone", "Activity Type", "Oil", "Gas", "Water", "CO2", "Injection", "Nitrogen", "NGL", "Sulphur",
    "Allocation Factor", "Days On"];
  WHheaders = ["Well ID", "Operator", "Well Name", "Well Number", "Latitude", "Longitude", "Status", "Classification", "Datum Elevation",
    "Ground Elevation", "Plugback Depth", "TD", "Formation at TD", "Spud Date", "Completion Date", "Permit Date", "User Date", "Area",
    "District", "Field", "State", "County", "Country", "Platform ID", "Water Depth", "Water Datum", "Permit Number", "Datum Type", "Alternate ID",
    "Old ID", "User 1", "User 2", "Lease Name", "Parent UWI", "Parent UWI Type", "Legal Survey Type", "Common Well Name", "Proposed", "Remarks",
    "Meridian", "Township", "Township Direction", "Range", "Range Direction", "Section", "Qtr4", "Qtr3", "Qtr2", "Qtr1", "Footage NS", "NS",
    "Footage EW", "EW", "Location Accuracy", "TVD"];

  public barChartData: ChartDataSets[];
  public doughNutChartData;
  public barChartLabels: Label[];
  public doughNutChartLabels: Label[];
  public barChartLegend = false;
  public doughNutChartLegend = false;
  public barChartType: ChartType;
  public doughNutChartType: ChartType = 'doughnut';
  // lineChart
  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  public lineChartLegend = true;
  public lineChartPlugins = [];
  // public lineChartOptions;
  public lineChartType: ChartType = 'line';
 
  public doughNutChartOptions: ChartOptions = {};
  public title;
  public linetitle;
  public operatortitle;

  //semi circle guage
  public canvasWidth = 300;
  public needleValue = 65;
  public centralLabel = '';
  public name = 'Gauge chart';
  public bottomLabel = '65';
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 1000,
    arcColors: ['rgb(44, 151, 222)', 'lightgray'],
    arcDelimiters: [30],
    rangeLabel: ['0', '100'],
    needleStartValue: 50,
  };
  //horizontal bar chart
  public chartType: string = 'horizontalBar';
  public chartDatasets: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' }
  ];

  public chartLabels: Array<any> = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }



  // public lineChartColors: Color[] = [
  //   {
  //     borderColor: '#39e600',
  //     borderWidth: 3,
  //     // backgroundColor: 'transparent',
  //     pointBackgroundColor: 'blue',
  //     pointBorderColor: 'blue',
  //     pointBorderWidth: 3
  //   }
  // ];

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
    legend: { display: false, position: 'bottom', }
  };

  public barChartColors: Color[] = [{
    borderColor: '#0000cc',
    backgroundColor: '#33a02c'
  }];


  WH() {
    this.hideTableWH = true;
    this.hideTableCP = false;
    this.hideTableST = false;
    this.hideTableMC = false;
    this.hideTableIP = false;
    this.hideTableFT = false;
    this.hideTablePF = false;
    this.hideTablePT = false;
    document.getElementById("mc").style.fontStyle = "italic";
    document.getElementById("ip").style.fontStyle = "italic";
    document.getElementById("cp").style.fontStyle = "italic";
    document.getElementById("ft").style.fontStyle = "italic";
    document.getElementById("pf").style.fontStyle = "italic";
    document.getElementById("st").style.fontStyle = "italic";
    document.getElementById("pt").style.fontStyle = "italic";

    if (this.wellDetailsWH.length) {
      document.getElementById("wh").style.fontStyle = "normal";
      document.getElementById("wh").style.color = "blue";
      //highlighting selected tab
      document.getElementById("wh").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  WH1() {
    this.hideTableWH1 = true;
    this.hideTableCP1 = false;
    this.hideTableST1 = false;
    this.hideTableMC1 = false;
    this.hideTableIP1 = false;
    this.hideTableFT1 = false;
    this.hideTablePF1 = false;
    this.hideTablePT1 = false;
    document.getElementById("mc1").style.fontStyle = "italic";
    document.getElementById("ip1").style.fontStyle = "italic";
    document.getElementById("cp1").style.fontStyle = "italic";
    document.getElementById("ft1").style.fontStyle = "italic";
    document.getElementById("pf1").style.fontStyle = "italic";
    document.getElementById("st1").style.fontStyle = "italic";
    document.getElementById("pt1").style.fontStyle = "italic";

    if (this.wellDetailsWH.length) {
      document.getElementById("wh1").style.fontStyle = "normal";
      document.getElementById("wh1").style.color = "blue";
      //highlighting selected tab
      document.getElementById("wh1").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt1").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  WH2() {
    this.hideTableWH2 = true;
    this.hideTableCP2 = false;
    this.hideTableST2 = false;
    this.hideTableMC2 = false;
    this.hideTableIP2 = false;
    this.hideTableFT2 = false;
    this.hideTablePF2 = false;
    this.hideTablePT2 = false;
    document.getElementById("mc2").style.fontStyle = "italic";
    document.getElementById("ip2").style.fontStyle = "italic";
    document.getElementById("cp2").style.fontStyle = "italic";
    document.getElementById("ft2").style.fontStyle = "italic";
    document.getElementById("pf2").style.fontStyle = "italic";
    document.getElementById("st2").style.fontStyle = "italic";
    document.getElementById("pt2").style.fontStyle = "italic";

    if (this.wellDetailsWH.length) {
      document.getElementById("wh2").style.fontStyle = "normal";
      document.getElementById("wh2").style.color = "blue";
      //highlighting selected tab
      document.getElementById("wh2").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt2").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  MC() {
    this.hideTableMC = true;
    this.hideTableWH = false;
    this.hideTableCP = false;
    this.hideTableST = false;
    this.hideTableIP = false;
    this.hideTableFT = false;
    this.hideTablePF = false;
    this.hideTablePT = false;
    document.getElementById("wh").style.fontStyle = "italic";
    document.getElementById("ip").style.fontStyle = "italic";
    document.getElementById("cp").style.fontStyle = "italic";
    document.getElementById("ft").style.fontStyle = "italic";
    document.getElementById("pf").style.fontStyle = "italic";
    document.getElementById("st").style.fontStyle = "italic";
    document.getElementById("pt").style.fontStyle = "italic";

    if (this.wellDetailsMC.length) {
      document.getElementById("mc").style.fontStyle = "normal";
      document.getElementById("mc").style.color = "blue";
      //highlighting selected tab
      document.getElementById("mc").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsWH.length) {
        document.getElementById("wh").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  MC1() {
    this.hideTableMC1 = true;
    this.hideTableWH1 = false;
    this.hideTableCP1 = false;
    this.hideTableST1 = false;
    this.hideTableIP1 = false;
    this.hideTableFT1 = false;
    this.hideTablePF1 = false;
    this.hideTablePT1 = false;
    document.getElementById("wh1").style.fontStyle = "italic";
    document.getElementById("ip1").style.fontStyle = "italic";
    document.getElementById("cp1").style.fontStyle = "italic";
    document.getElementById("ft1").style.fontStyle = "italic";
    document.getElementById("pf1").style.fontStyle = "italic";
    document.getElementById("st1").style.fontStyle = "italic";
    document.getElementById("pt1").style.fontStyle = "italic";

    if (this.wellDetailsMC.length) {
      document.getElementById("mc1").style.fontStyle = "normal";
      document.getElementById("mc1").style.color = "blue";
      //highlighting selected tab
      document.getElementById("mc1").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsWH.length) {
        document.getElementById("wh1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt1").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  MC2() {
    this.hideTableMC2 = true;
    this.hideTableWH2 = false;
    this.hideTableCP2 = false;
    this.hideTableST2 = false;
    this.hideTableIP2 = false;
    this.hideTableFT2 = false;
    this.hideTablePF2 = false;
    this.hideTablePT2 = false;
    document.getElementById("wh2").style.fontStyle = "italic";
    document.getElementById("ip2").style.fontStyle = "italic";
    document.getElementById("cp2").style.fontStyle = "italic";
    document.getElementById("ft2").style.fontStyle = "italic";
    document.getElementById("pf2").style.fontStyle = "italic";
    document.getElementById("st2").style.fontStyle = "italic";
    document.getElementById("pt2").style.fontStyle = "italic";

    if (this.wellDetailsMC.length) {
      document.getElementById("mc2").style.fontStyle = "normal";
      document.getElementById("mc2").style.color = "blue";
      //highlighting selected tab
      document.getElementById("mc2").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsWH.length) {
        document.getElementById("wh2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt2").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  IP() {
    this.hideTableIP = true;
    this.hideTableMC = false;
    this.hideTableWH = false;
    this.hideTableCP = false;
    this.hideTableST = false;
    this.hideTableFT = false;
    this.hideTablePF = false;
    this.hideTablePT = false;
    document.getElementById("wh").style.fontStyle = "italic";
    document.getElementById("mc").style.fontStyle = "italic";
    document.getElementById("cp").style.fontStyle = "italic";
    document.getElementById("ft").style.fontStyle = "italic";
    document.getElementById("pf").style.fontStyle = "italic";
    document.getElementById("st").style.fontStyle = "italic";
    document.getElementById("pt").style.fontStyle = "italic";

    if (this.wellDetailsIP.length) {
      document.getElementById("ip").style.fontStyle = "normal";
      document.getElementById("ip").style.color = "blue";
      //highlighting selected tab
      document.getElementById("ip").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  IP1() {
    this.hideTableIP1 = true;
    this.hideTableMC1 = false;
    this.hideTableWH1 = false;
    this.hideTableCP1 = false;
    this.hideTableST1 = false;
    this.hideTableFT1 = false;
    this.hideTablePF1 = false;
    this.hideTablePT1 = false;
    document.getElementById("wh1").style.fontStyle = "italic";
    document.getElementById("mc1").style.fontStyle = "italic";
    document.getElementById("cp1").style.fontStyle = "italic";
    document.getElementById("ft1").style.fontStyle = "italic";
    document.getElementById("pf1").style.fontStyle = "italic";
    document.getElementById("st1").style.fontStyle = "italic";
    document.getElementById("pt1").style.fontStyle = "italic";

    if (this.wellDetailsIP.length) {
      document.getElementById("ip1").style.fontStyle = "normal";
      document.getElementById("ip1").style.color = "blue";
      //highlighting selected tab
      document.getElementById("ip1").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt1").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  IP2() {
    this.hideTableIP2 = true;
    this.hideTableMC2 = false;
    this.hideTableWH2 = false;
    this.hideTableCP2 = false;
    this.hideTableST2 = false;
    this.hideTableFT2 = false;
    this.hideTablePF2 = false;
    this.hideTablePT2 = false;
    document.getElementById("wh2").style.fontStyle = "italic";
    document.getElementById("mc2").style.fontStyle = "italic";
    document.getElementById("cp2").style.fontStyle = "italic";
    document.getElementById("ft2").style.fontStyle = "italic";
    document.getElementById("pf2").style.fontStyle = "italic";
    document.getElementById("st2").style.fontStyle = "italic";
    document.getElementById("pt2").style.fontStyle = "italic";

    if (this.wellDetailsIP.length) {
      document.getElementById("ip2").style.fontStyle = "normal";
      document.getElementById("ip2").style.color = "blue";
      //highlighting selected tab
      document.getElementById("ip2").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt2").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  CP() {
    this.hideTableCP = true;
    this.hideTableWH = false;
    this.hideTableST = false;
    this.hideTableIP = false;
    this.hideTableMC = false;
    this.hideTableFT = false;
    this.hideTablePF = false;
    this.hideTablePT = false;
    document.getElementById("wh").style.fontStyle = "italic";
    document.getElementById("mc").style.fontStyle = "italic";
    document.getElementById("ip").style.fontStyle = "italic";
    document.getElementById("ft").style.fontStyle = "italic";
    document.getElementById("pf").style.fontStyle = "italic";
    document.getElementById("st").style.fontStyle = "italic";
    document.getElementById("pt").style.fontStyle = "italic";

    if (this.wellDetailsCP.length) {
      document.getElementById("cp").style.fontStyle = "normal";
      document.getElementById("cp").style.color = "blue";
      //highlighting selected tab
      document.getElementById("cp").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  CP1() {
    this.hideTableCP1 = true;
    this.hideTableWH1 = false;
    this.hideTableST1 = false;
    this.hideTableIP1 = false;
    this.hideTableMC1 = false;
    this.hideTableFT1 = false;
    this.hideTablePF1 = false;
    this.hideTablePT1 = false;
    document.getElementById("wh1").style.fontStyle = "italic";
    document.getElementById("mc1").style.fontStyle = "italic";
    document.getElementById("ip1").style.fontStyle = "italic";
    document.getElementById("ft1").style.fontStyle = "italic";
    document.getElementById("pf1").style.fontStyle = "italic";
    document.getElementById("st1").style.fontStyle = "italic";
    document.getElementById("pt1").style.fontStyle = "italic";

    if (this.wellDetailsCP.length) {
      document.getElementById("cp1").style.fontStyle = "normal";
      document.getElementById("cp1").style.color = "blue";
      //highlighting selected tab
      document.getElementById("cp1").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt1").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  CP2() {
    this.hideTableCP2 = true;
    this.hideTableWH2 = false;
    this.hideTableST2 = false;
    this.hideTableIP2 = false;
    this.hideTableMC2 = false;
    this.hideTableFT2 = false;
    this.hideTablePF2 = false;
    this.hideTablePT2 = false;
    document.getElementById("wh2").style.fontStyle = "italic";
    document.getElementById("mc2").style.fontStyle = "italic";
    document.getElementById("ip2").style.fontStyle = "italic";
    document.getElementById("ft2").style.fontStyle = "italic";
    document.getElementById("pf2").style.fontStyle = "italic";
    document.getElementById("st2").style.fontStyle = "italic";
    document.getElementById("pt2").style.fontStyle = "italic";

    if (this.wellDetailsCP.length) {
      document.getElementById("cp2").style.fontStyle = "normal";
      document.getElementById("cp2").style.color = "blue";
      //highlighting selected tab
      document.getElementById("cp2").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt2").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  FT() {
    this.hideTableFT = true;
    this.hideTableCP = false;
    this.hideTableWH = false;
    this.hideTableST = false;
    this.hideTableIP = false;
    this.hideTableMC = false;
    this.hideTablePF = false;
    this.hideTablePT = false;
    document.getElementById("wh").style.fontStyle = "italic";
    document.getElementById("mc").style.fontStyle = "italic";
    document.getElementById("ip").style.fontStyle = "italic";
    document.getElementById("cp").style.fontStyle = "italic";
    document.getElementById("pf").style.fontStyle = "italic";
    document.getElementById("st").style.fontStyle = "italic";
    document.getElementById("pt").style.fontStyle = "italic";

    if (this.wellDetailsFT.length) {
      document.getElementById("ft").style.fontStyle = "normal";
      document.getElementById("ft").style.color = "blue";
      //highlighting selected tab
      document.getElementById("ft").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  FT1() {
    this.hideTableFT1 = true;
    this.hideTableCP1 = false;
    this.hideTableWH1 = false;
    this.hideTableST1 = false;
    this.hideTableIP1 = false;
    this.hideTableMC1 = false;
    this.hideTablePF1 = false;
    this.hideTablePT1 = false;
    document.getElementById("wh1").style.fontStyle = "italic";
    document.getElementById("mc1").style.fontStyle = "italic";
    document.getElementById("ip1").style.fontStyle = "italic";
    document.getElementById("cp1").style.fontStyle = "italic";
    document.getElementById("pf1").style.fontStyle = "italic";
    document.getElementById("st1").style.fontStyle = "italic";
    document.getElementById("pt1").style.fontStyle = "italic";

    if (this.wellDetailsFT.length) {
      document.getElementById("ft1").style.fontStyle = "normal";
      document.getElementById("ft1").style.color = "blue";
      //highlighting selected tab
      document.getElementById("ft1").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt1").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  FT2() {
    this.hideTableFT2 = true;
    this.hideTableCP2 = false;
    this.hideTableWH2 = false;
    this.hideTableST2 = false;
    this.hideTableIP2 = false;
    this.hideTableMC2 = false;
    this.hideTablePF2 = false;
    this.hideTablePT2 = false;
    document.getElementById("wh2").style.fontStyle = "italic";
    document.getElementById("mc2").style.fontStyle = "italic";
    document.getElementById("ip2").style.fontStyle = "italic";
    document.getElementById("cp2").style.fontStyle = "italic";
    document.getElementById("pf2").style.fontStyle = "italic";
    document.getElementById("st2").style.fontStyle = "italic";
    document.getElementById("pt2").style.fontStyle = "italic";

    if (this.wellDetailsFT.length) {
      document.getElementById("ft2").style.fontStyle = "normal";
      document.getElementById("ft2").style.color = "blue";
      //highlighting selected tab
      document.getElementById("ft2").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt2").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  PF() {
    this.hideTablePF = true;
    this.hideTableFT = false;
    this.hideTableCP = false;
    this.hideTableWH = false;
    this.hideTableST = false;
    this.hideTableIP = false;
    this.hideTableMC = false;
    this.hideTablePT = false;
    document.getElementById("wh").style.fontStyle = "italic";
    document.getElementById("mc").style.fontStyle = "italic";
    document.getElementById("ip").style.fontStyle = "italic";
    document.getElementById("cp").style.fontStyle = "italic";
    document.getElementById("ft").style.fontStyle = "italic";
    document.getElementById("st").style.fontStyle = "italic";
    document.getElementById("pt").style.fontStyle = "italic";

    if (this.wellDetailsPF.length) {
      document.getElementById("pf").style.fontStyle = "normal";
      document.getElementById("pf").style.color = "blue";
      //highlighting selected tab
      document.getElementById("pf").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  PF1() {
    this.hideTablePF1 = true;
    this.hideTableFT1 = false;
    this.hideTableCP1 = false;
    this.hideTableWH1 = false;
    this.hideTableST1 = false;
    this.hideTableIP1 = false;
    this.hideTableMC1 = false;
    this.hideTablePT1 = false;
    document.getElementById("wh1").style.fontStyle = "italic";
    document.getElementById("mc1").style.fontStyle = "italic";
    document.getElementById("ip1").style.fontStyle = "italic";
    document.getElementById("cp1").style.fontStyle = "italic";
    document.getElementById("ft1").style.fontStyle = "italic";
    document.getElementById("st1").style.fontStyle = "italic";
    document.getElementById("pt1").style.fontStyle = "italic";

    if (this.wellDetailsPF.length) {
      document.getElementById("pf1").style.fontStyle = "normal";
      document.getElementById("pf1").style.color = "blue";
      //highlighting selected tab
      document.getElementById("pf1").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt1").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  PF2() {
    this.hideTablePF2 = true;
    this.hideTableFT2 = false;
    this.hideTableCP2 = false;
    this.hideTableWH2 = false;
    this.hideTableST2 = false;
    this.hideTableIP2 = false;
    this.hideTableMC2 = false;
    this.hideTablePT2 = false;
    document.getElementById("wh2").style.fontStyle = "italic";
    document.getElementById("mc2").style.fontStyle = "italic";
    document.getElementById("ip2").style.fontStyle = "italic";
    document.getElementById("cp2").style.fontStyle = "italic";
    document.getElementById("ft2").style.fontStyle = "italic";
    document.getElementById("st2").style.fontStyle = "italic";
    document.getElementById("pt2").style.fontStyle = "italic";

    if (this.wellDetailsPF.length) {
      document.getElementById("pf2").style.fontStyle = "normal";
      document.getElementById("pf2").style.color = "blue";
      //highlighting selected tab
      document.getElementById("pf2").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt2").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  ST() {
    this.hideTableST = true;
    this.hideTableWH = false;
    this.hideTableCP = false;
    this.hideTablePF = false;
    this.hideTableFT = false;
    this.hideTableIP = false;
    this.hideTableMC = false;
    this.hideTablePT = false;
    document.getElementById("wh").style.fontStyle = "italic";
    document.getElementById("mc").style.fontStyle = "italic";
    document.getElementById("ip").style.fontStyle = "italic";
    document.getElementById("cp").style.fontStyle = "italic";
    document.getElementById("ft").style.fontStyle = "italic";
    document.getElementById("pf").style.fontStyle = "italic";
    document.getElementById("pt").style.fontStyle = "italic";

    if (this.wellDetailsSurvey.length) {
      document.getElementById("st").style.fontStyle = "normal";
      document.getElementById("st").style.color = "blue";
      //highlighting selected tab
      document.getElementById("st").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  ST1() {
    this.hideTableST1 = true;
    this.hideTableWH1 = false;
    this.hideTableCP1 = false;
    this.hideTablePF1 = false;
    this.hideTableFT1 = false;
    this.hideTableIP1 = false;
    this.hideTableMC1 = false;
    this.hideTablePT1 = false;
    document.getElementById("wh1").style.fontStyle = "italic";
    document.getElementById("mc1").style.fontStyle = "italic";
    document.getElementById("ip1").style.fontStyle = "italic";
    document.getElementById("cp1").style.fontStyle = "italic";
    document.getElementById("ft1").style.fontStyle = "italic";
    document.getElementById("pf1").style.fontStyle = "italic";
    document.getElementById("pt1").style.fontStyle = "italic";

    if (this.wellDetailsSurvey.length) {
      document.getElementById("st1").style.fontStyle = "normal";
      document.getElementById("st1").style.color = "blue";
      //highlighting selected tab
      document.getElementById("st1").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt1").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  ST2() {
    this.hideTableST2 = true;
    this.hideTableWH2 = false;
    this.hideTableCP2 = false;
    this.hideTablePF2 = false;
    this.hideTableFT2 = false;
    this.hideTableIP2 = false;
    this.hideTableMC2 = false;
    this.hideTablePT2 = false;
    document.getElementById("wh2").style.fontStyle = "italic";
    document.getElementById("mc2").style.fontStyle = "italic";
    document.getElementById("ip2").style.fontStyle = "italic";
    document.getElementById("cp2").style.fontStyle = "italic";
    document.getElementById("ft2").style.fontStyle = "italic";
    document.getElementById("pf2").style.fontStyle = "italic";
    document.getElementById("pt2").style.fontStyle = "italic";

    if (this.wellDetailsSurvey.length) {
      document.getElementById("st2").style.fontStyle = "normal";
      document.getElementById("st2").style.color = "blue";
      //highlighting selected tab
      document.getElementById("st2").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPT.length) {
        document.getElementById("pt2").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  PT() {
    this.hideTablePT = true;
    this.hideTableST = false;
    this.hideTableWH = false;
    this.hideTableCP = false;
    this.hideTablePF = false;
    this.hideTableFT = false;
    this.hideTableIP = false;
    this.hideTableMC = false;
    document.getElementById("wh").style.fontStyle = "italic";
    document.getElementById("mc").style.fontStyle = "italic";
    document.getElementById("ip").style.fontStyle = "italic";
    document.getElementById("cp").style.fontStyle = "italic";
    document.getElementById("ft").style.fontStyle = "italic";
    document.getElementById("pf").style.fontStyle = "italic";
    document.getElementById("st").style.fontStyle = "italic";

    if (this.wellDetailsPT.length) {
      document.getElementById("pt").style.fontStyle = "normal";
      document.getElementById("pt").style.color = "blue";
      //highlighting selected tab
      document.getElementById("pt").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  PT1() {
    this.hideTablePT1 = true;
    this.hideTableST1 = false;
    this.hideTableWH1 = false;
    this.hideTableCP1 = false;
    this.hideTablePF1 = false;
    this.hideTableFT1 = false;
    this.hideTableIP1 = false;
    this.hideTableMC1 = false;
    document.getElementById("wh1").style.fontStyle = "italic";
    document.getElementById("mc1").style.fontStyle = "italic";
    document.getElementById("ip1").style.fontStyle = "italic";
    document.getElementById("cp1").style.fontStyle = "italic";
    document.getElementById("ft1").style.fontStyle = "italic";
    document.getElementById("pf1").style.fontStyle = "italic";
    document.getElementById("st1").style.fontStyle = "italic";

    if (this.wellDetailsPT.length) {
      document.getElementById("pt1").style.fontStyle = "normal";
      document.getElementById("pt1").style.color = "blue";
      //highlighting selected tab
      document.getElementById("pt1").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st1").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh1").style.backgroundColor = "#F8CBAD";
      }
    }
  }
  PT2() {
    this.hideTablePT2 = true;
    this.hideTableST2 = false;
    this.hideTableWH2 = false;
    this.hideTableCP2 = false;
    this.hideTablePF2 = false;
    this.hideTableFT2 = false;
    this.hideTableIP2 = false;
    this.hideTableMC2 = false;
    document.getElementById("wh2").style.fontStyle = "italic";
    document.getElementById("mc2").style.fontStyle = "italic";
    document.getElementById("ip2").style.fontStyle = "italic";
    document.getElementById("cp2").style.fontStyle = "italic";
    document.getElementById("ft2").style.fontStyle = "italic";
    document.getElementById("pf2").style.fontStyle = "italic";
    document.getElementById("st2").style.fontStyle = "italic";

    if (this.wellDetailsPT.length) {
      document.getElementById("pt2").style.fontStyle = "normal";
      document.getElementById("pt2").style.color = "blue";
      //highlighting selected tab
      document.getElementById("pt2").style.backgroundColor = "#A9D08E";
      //changing bgcolor to orange for remaining layers
      if (this.wellDetailsMC.length) {
        document.getElementById("mc2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsIP.length) {
        document.getElementById("ip2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsCP.length) {
        document.getElementById("cp2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsFT.length) {
        document.getElementById("ft2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsPF.length) {
        document.getElementById("pf2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st2").style.backgroundColor = "#F8CBAD";
      }
      if (this.wellDetailsWH.length) {
        document.getElementById("wh2").style.backgroundColor = "#F8CBAD";
      }

    }
  }

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
      if (this.wellDetailsCP.length) {
        document.getElementById("cp").style.color = "blue";
        document.getElementById("cp1").style.color = "blue";
        document.getElementById("cp2").style.color = "blue";
        document.getElementById("cp").style.backgroundColor = "#F8CBAD";
        document.getElementById("cp1").style.backgroundColor = "#F8CBAD";
        document.getElementById("cp2").style.backgroundColor = "#F8CBAD";
      }
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
      if (this.wellDetailsFT.length) {
        document.getElementById("ft").style.color = "blue";
        document.getElementById("ft1").style.color = "blue";
        document.getElementById("ft2").style.color = "blue";
        document.getElementById("ft").style.backgroundColor = "#F8CBAD";
        document.getElementById("ft1").style.backgroundColor = "#F8CBAD";
        document.getElementById("ft2").style.backgroundColor = "#F8CBAD";
      }
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
      if (this.wellDetailsMC.length) {
        document.getElementById("mc").style.color = "blue";
        document.getElementById("mc1").style.color = "blue";
        document.getElementById("mc2").style.color = "blue";
        document.getElementById("mc").style.backgroundColor = "#F8CBAD";
        document.getElementById("mc1").style.backgroundColor = "#F8CBAD";
        document.getElementById("mc2").style.backgroundColor = "#F8CBAD";
      }
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
      if (this.wellDetailsPF.length) {
        document.getElementById("pf").style.color = "blue";
        document.getElementById("pf1").style.color = "blue";
        document.getElementById("pf2").style.color = "blue";
        document.getElementById("pf").style.backgroundColor = "#F8CBAD";
        document.getElementById("pf1").style.backgroundColor = "#F8CBAD";
        document.getElementById("pf2").style.backgroundColor = "#F8CBAD";
      }
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
      if (this.wellDetailsSurvey.length) {
        document.getElementById("st").style.color = "blue";
        document.getElementById("st1").style.color = "blue";
        document.getElementById("st2").style.color = "blue";
        document.getElementById("st").style.backgroundColor = "#F8CBAD";
        document.getElementById("st1").style.backgroundColor = "#F8CBAD";
        document.getElementById("st2").style.backgroundColor = "#F8CBAD";
      }
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
      if (this.wellDetailsIP.length) {
        document.getElementById("ip").style.color = "blue";
        document.getElementById("ip1").style.color = "blue";
        document.getElementById("ip2").style.color = "blue";
        document.getElementById("ip").style.backgroundColor = "#F8CBAD";
        document.getElementById("ip1").style.backgroundColor = "#F8CBAD";
        document.getElementById("ip2").style.backgroundColor = "#F8CBAD";
      }
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
      if (this.wellDetailsPT.length) {
        document.getElementById("pt").style.color = "blue";
        document.getElementById("pt1").style.color = "blue";
        document.getElementById("pt2").style.color = "blue";
        document.getElementById("pt").style.backgroundColor = "#F8CBAD";
        document.getElementById("pt1").style.backgroundColor = "#F8CBAD";
        document.getElementById("pt2").style.backgroundColor = "#F8CBAD";
      }
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
      this.xaxisHover = data.map((res) => {
        return res.year_mon
      });
      // console.log('xaxis', this.xaxisHover);
      this.lineChartData = [{
        data: oilvalues,
        label: this.xaxisHover,
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
              maxTicksLimit: 5,  //limit on axis
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
        tooltips: { //hover part
          mode: 'index',
          intersect: false,
          enabled: true,
          // displayColors: false,
          xPadding: 15,
          yPadding: 15,
          callbacks: {
            title: (item, data) => {
              return ""
            },
            label: (item, data) => {
              // console.log("item", item);
              // console.log("data", data);
              // console.log("datasetlen", data.datasets[0].label[item.index]);
              var datasetLabel = data.datasets[0].label[item.index];
              var dataPoint = item.yLabel;
              return "Oil: " + dataPoint + " " + 'BBL' + " ---- " + datasetLabel;
              // debugger
              // return "Oil: " + item.yLabel + " " + 'BBL' + " ---- " + this.xaxisHover[item.index];
            },
          },
        },
        hover: {
          mode: 'index',
          intersect: false
        },
        showLines: true,
        legend: { display: false, position: 'bottom' }
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
      this.linetitle = 'Well Production';
      this.chartReady = true;
    });
  }

  //for default oil production data
  public lineChartOptions: ChartOptions = {
    scales: {
      xAxes: [{
        gridLines: { drawOnChartArea: false, lineWidth: 5 },
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Year'
        },
        ticks: {
          maxTicksLimit: 5, //interval limit
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
    tooltips: {       //hover part
      enabled: true,
      // displayColors: false,
      xPadding: 15,
      yPadding: 15,
      callbacks: {
        title: (item, data) => {
          return ""
        },
        label: (item, data) => {
          // console.log("item", item);
          // console.log("datasetlen", data.datasets[0].label[item.index]);
          // debugger
          var datasetLabel = data.datasets[0].label[item.index];
          var dataPoint = item.yLabel;
          return "Oil: " + dataPoint + " " + 'BBL' + " ---- " + datasetLabel;
          // return "Oil: " + item.yLabel + " " + 'BBL' + " ---- " + this.xaxisHover[item.index];
        },
      },
    },
    showLines: true,
    legend: { display: false, position: 'bottom' }
  };

  fetchGasProductionDataForChart(wellId) {
    this.detailService.fetchGasProductionChartData(wellId).subscribe((data) => {
      this.lineChartLabels = data.map((res) => {
        return res.date
      });
      let gasvalues = data.map((res) => {
        return res.gas
      });
      this.xaxisHover = data.map((res) => {
        return res.year_mon
      });
      this.lineChartData = [{
        data: gasvalues,
        label: this.xaxisHover,
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
              maxTicksLimit: 5,
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
        tooltips: {       //hover part
          enabled: true,
          // displayColors: false,
          xPadding: 15,
          yPadding: 15,
          callbacks: {
            title: (item, data) => {
              return ""
            },
            label: (item, data) => {
              // console.log('itemgas', item);
              // console.log('data', data);
              // console.log("datasetlen", data.datasets[0].label[item.index]);
              var datasetLabel = data.datasets[0].label[item.index];
              var dataPoint = item.yLabel;
              return "Gas: " + dataPoint + " " + 'MCF' + " ---- " + datasetLabel;
              // return "Gas: " + item.yLabel + " " + 'MCF' + " ---- " + this.xaxisHover[item.index];
            },
          },
        },
        showLines: true,
        legend: { display: false, position: 'bottom' }
      };
      this.lineChartColors = [
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

  oilProduction() {
    this.linetitle = 'Well Production';
    this.fetchOilProductionDataForChart(this.wellId);
  }

  gasProduction() {
    this.linetitle = 'Well Production';
    this.fetchGasProductionDataForChart(this.wellId);
  }

  fetchOilProductionZoneDataForChart() {
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
      this.barChartOptions = {
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
        legend: { display: false, position: 'bottom', }
      };
      this.barChartColors = [{ borderColor: '#0000cc', backgroundColor: '#33a02c' }];
      this.barChartType = 'bar';
      this.barChartLegend = true;
      this.title = 'Zone Wise Values';
      this.chartReady = true;
      // store the chart values in zoneChartSubject subject, DOnt change this configuration
      const barChartConfig = {
        barChartData: this.barChartData,
        barChartLabels: this.barChartLabels,
        barChartOptions: this.barChartOptions,
        barChartColors: this.barChartColors,
        barChartLegend: this.barChartLegend,
        barChartType: this.barChartType,
      };
      this._apiservice.emitZoneChartSubject(barChartConfig);
    });
  }

  fetchGasProductionZoneDataForChart() {
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
      this.barChartOptions = {
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
        legend: { display: false, position: 'bottom', }
      };
      this.barChartColors = [{ borderColor: '#0000cc', backgroundColor: '#F93C3D' }];
      this.barChartType = 'bar';
      this.barChartLegend = true;
      this.chartReady = true;
    });
  }

  oilProductionzone() {
    this.title = 'Zone Wise Values';
    this.fetchOilProductionZoneDataForChart();
  }

  gasProductionzone() {
    this.title = 'Zone Wise Values';
    this.fetchGasProductionZoneDataForChart();
  }

  fetchOperatorDataForChart(wellId) {
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
        legend: { display: false, position: 'right' }
      };
      this.doughNutChartData = [{
        data: countvalue,
        label: 'County',
      }];

      this.chartReady = true;
    });
  }

  // operator() {
  // this.operatortitle = 'County Operators';
  // this.fetchOperatorDataForChart(this.wellId);
  // }

  fetchWhWellDetail(wellId) {
    this.detailService.fetchWhWellDetails(wellId).subscribe((data) => {
      this.wellDetailsWH = data.map((innerData) => {
        return Object.keys(innerData).map((res) => {
          return {
            key: res,
            value: innerData[res]
          }
        });
      });// console.log("WH:",this.wellDetailsWH);
      if (this.wellDetailsWH.length) {
        document.getElementById("wh").style.color = "blue";
        document.getElementById("wh1").style.color = "blue";
        document.getElementById("wh2").style.color = "blue";
        document.getElementById("wh").style.backgroundColor = "#F8CBAD";
        document.getElementById("wh1").style.backgroundColor = "#F8CBAD";
        document.getElementById("wh2").style.backgroundColor = "#F8CBAD";
      }
    });
  }

  fetchPtmaxOilGas(wellId) {
    this.detailService.fetchPtmaxOilGasDetails(wellId).subscribe((data) => {
      this.maxoilvalue = data.map((res) => {
        return res.maxoil
      });
      this.maxgasvalue = data.map((res) => {
        return res.maxgas
      });
    });
  }

  fetchPtminOil(wellId) {
    this.detailService.fetchPtminOilDetails(wellId).subscribe((data) => {
      this.minoilvalue = data.map((res) => {
        return res.minoil
      });
    });
  }

  fetchPtminGas(wellId) {
    this.detailService.fetchPtminGasDetails(wellId).subscribe((data) => {
      this.mingasvalue = data.map((res) => {
        return res.mingas
      });
    });
  }

  fetchPtmonthlyAvgOilGas(wellId) {
    this.detailService.fetchPtmonthlyAvgOilGasDetails(wellId).subscribe((data) => {
      this.monthlyavgoilvalue = data.map((res) => {
        return res.monthlyavg_oil
      });
      this.monthlyavggasvalue = data.map((res) => {
        return res.monthlyavg_gas
      });
    });
  }

  fetchPtyearlyAvgOilGas(wellId) {
    this.detailService.fetchPtyearlyAvgOilGasDetails(wellId).subscribe((data) => {
      this.yearlyavgoilvalue = data.map((res) => {
        return res.yearlyavg_oil
      });
      this.yearlyavggasvalue = data.map((res) => {
        return res.yearlyavg_gas
      });
    });
  }

  fetchPtmaxyearlyOilGas(wellId) {
    this.detailService.fetchPtmaxyearlyOilGasDetails(wellId).subscribe((data) => {
      this.maxyearlyoilvalue = data.map((res) => {
        return res.maxyearly_oil
      });
      this.maxyearlygasvalue = data.map((res) => {
        return res.maxyearly_gas
      });
    });
  }


  fetchPtminyearlyOil(wellId) {
    this.detailService.fetchPtminyearlyOilDetails(wellId).subscribe((data) => {
      this.minyearlyoilvalue = data.map((res) => {
        return res.minyearly_oil
      });
    });
  }

  fetchPtminyearlyGas(wellId) {
    this.detailService.fetchPtminyearlyGasDetails(wellId).subscribe((data) => {
      this.minyearlygasvalue = data.map((res) => {
        return res.minyearly_gas
      });
    });
  }

  fetchPtfirstmonthOil(wellId) {
    this.detailService.fetchPtfirstmonthOilDetails(wellId).subscribe((data) => {
      this.firstmonthoilvalue = data.map((res) => {
        return res.firstmonthoil
      });
    });
  }

  fetchPtfirstmonthGas(wellId) {
    this.detailService.fetchPtfirstmonthGasDetails(wellId).subscribe((data) => {
      this.firstmonthgasvalue = data.map((res) => {
        return res.firstmonthgas
      });
    });
  }

  fetchPtlastmonthOil(wellId) {
    this.detailService.fetchPtlastmonthOilDetails(wellId).subscribe((data) => {
      this.lastmonthoilvalue = data.map((res) => {
        return res.lastmonthoil
      });
    });
  }

  fetchPtlastmonthGas(wellId) {
    this.detailService.fetchPtlastmonthGasDetails(wellId).subscribe((data) => {
      this.lastmonthgasvalue = data.map((res) => {
        return res.lastmonthgas
      });
    });
  }

  fetchPtmaxproductionDateOil(wellId) {
    this.detailService.fetchPtmaxproductionDateOilDetails(wellId).subscribe((data) => {
      this.oilmaxproddate = data.map((res) => {
        return res.maxprod_date
      });
    });
  }
  fetchPtmaxproductionDateGas(wellId) {
    this.detailService.fetchPtmaxproductionDateGasDetails(wellId).subscribe((data) => {
      this.gasmaxproddate = data.map((res) => {
        return res.maxprod_date
      });
    });
  }
  fetchPtFirstYearproductionOilGas(wellId) {
    this.detailService.fetchPtFirstYearproductionOilGasDetails(wellId).subscribe((data) => {
      this.firstyrprodoil = data.map((res) => {
        return res.sumoil
      });
      this.firstyrprodgas = data.map((res) => {
        return res.sumgas
      });
    });
  }
  fetchPtLastYearproductionOilGas(wellId) {
    this.detailService.fetchPtLastYearproductionOilGasDetails(wellId).subscribe((data) => {
      this.lastyrprodoil = data.map((res) => {
        return res.sumoil
      });
      this.lastyrprodgas = data.map((res) => {
        return res.sumgas
      });
    });
  }

  fetchPtFirstSixMonthsproductionOilGas(wellId) {
    this.detailService.fetchPtFirstSixMonthsproductionOilGasDetails(wellId).subscribe((data) => {
      this.firstsixmonprodoil = data.map((res) => {
        return res.sumoil
      });
      this.firstsixmonprodgas = data.map((res) => {
        return res.sumgas
      });
    });
  }
  fetchPtLastSixMonthsproductionOilGas(wellId) {
    this.detailService.fetchPtLastSixMonthsproductionOilGasDetails(wellId).subscribe((data) => {
      this.lastsixmonprodoil = data.map((res) => {
        return res.sumoil
      });
      this.lastsixmonprodgas = data.map((res) => {
        return res.sumgas
      });
    });
  }

  fetchPtCumproductionOilGas(wellId) {
    this.detailService.fetchPtCumproductionOilGasDetails(wellId).subscribe((data) => {
      this.cumprodoil = data.map((res) => {
        return res.sumoil
      });
      this.cumprodgas = data.map((res) => {
        return res.sumgas
      });
    });
  }
  
}

