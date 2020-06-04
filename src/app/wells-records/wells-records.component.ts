import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../_services/api.service';
import { tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedFilterComponent } from './advFilterDialog/advanced-filter/advanced-filter.component';
import { ColumnConstantsService } from './column-constants.service';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

@Component({
  selector: 'app-wells-records',
  templateUrl: './wells-records.component.html',
  styleUrls: ['./wells-records.component.scss']
})
export class WellsRecordsComponent implements OnInit, OnChanges {
  panelOpenState = false;
  totalAvailableWellsCount = 400;
  displayedColumns = [];
  availableColumns: string[] = [
    'select',
    'wellId',
    'wellName',
    'operator',
    'wellNumber',
    'status',
    'latitude',
    'longitude',
    'spudDate',
    'completionDate',
    'county',
    'datumType',
    'tvd',
    'reports'
  ];
  public wellDetailsMC: MatTableDataSource<any>;
  public wellDetailsCP: MatTableDataSource<any>;
  public wellDetailsPF: MatTableDataSource<any>;
  public wellDetailsFT: MatTableDataSource<any>;
  public wellDetailsSurvey: MatTableDataSource<any>;
  public wellDetailsIP: MatTableDataSource<any>;
  dataSource = [];
  @Input() payLoadFromFilter: any;
  @Input() mapExtent: any;
  @Output() filterByExtent = new EventEmitter();
  @Output() zoomTo = new EventEmitter();
  @Output() clearSelection = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() selectedRowEmit = new EventEmitter();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<any>(true, []);
  filterByMapExtentFlag: boolean;
  isLoading: boolean;
  payLoadWithParams: any = {};
  selectedTab = 0;
  constructor(public apiService: ApiService,
    public dialog: MatDialog,
    public columnConstants: ColumnConstantsService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.isLoading = true;
    const currentItem: SimpleChange = changes.payLoadFromFilter;
    const mapExtentValue: SimpleChange = changes.mapExtent;
    let payLoad: any = {
      offset: 0,
      limit: 5,
      points: [],
      wellsCriteria: []
    };
    if (currentItem && Object.keys(currentItem.currentValue).length) {
      payLoad = {
        offset: 0,
        limit: 5,
        wellsCriteria: this.payLoadFromFilter
      };
    }
    if (mapExtentValue && mapExtentValue.currentValue.length) {
      payLoad = {
        offset: 0,
        limit: 5,
        points: this.mapExtent
      };
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (Object.keys(payLoad).length) {
      Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    }
    if (Object.keys(this.payLoadWithParams[this.selectedTab]).length) {
      this.fetchData(this.payLoadWithParams[this.selectedTab]);
    }
  }
  ngOnInit() {

  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.loadWells(this.paginator.pageIndex, this.paginator.pageSize))
      )
      .subscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource[this.selectedTab].filter = filterValue.trim().toLowerCase();

    if (this.dataSource[this.selectedTab].paginator) {
      this.dataSource[this.selectedTab].paginator.firstPage();
    }
  }

  loadWells(offset = 0, limit = 5) {
    this.isLoading = true;
    if (Object.keys(this.payLoadFromFilter).length) {
      const payLoad = {
        offset,
        limit,
        wellsCriteria: this.payLoadFromFilter
      }
      if (Object.keys(payLoad).length) {
        Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
      }
      this.fetchData(this.payLoadWithParams[this.selectedTab]);
    } else {
      const payLoad = {
        offset,
        limit
      }
      if (Object.keys(payLoad).length) {
        Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
      }
      this.fetchData(this.payLoadWithParams[this.selectedTab]);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.dataSource[this.selectedTab]) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource[this.selectedTab].data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource[this.selectedTab].data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  filterEmit() {
    this.filterByMapExtentFlag = !this.filterByMapExtentFlag;
    this.filterByExtent.emit(this.filterByMapExtentFlag);
  }

  clear() {
    this.clearSelection.emit('true');
    this.selection.clear();
  }

  refreshEmit() {
    this.refresh.emit('true');
    this.selection.clear();
    this.fetchData(this.payLoadWithParams[this.selectedTab]);
  }

  zoomToEmit() {
    if (this.selection.selected.length) {
      this.zoomTo.emit(this.selection.selected);
    }
  }

  rowToggle($event) {
    if ($event.checked) {
      this.selectedRowEmit.emit(this.selection.selected[0]);
    } else {
      this.selectedRowEmit.emit(null);
    }
  }

  fetchData(payLoad) {
    this.isLoading = true;
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.WELL_RECORD_COLUMNS];
    }
    this.apiService.fetchWellsData(payLoad).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellDtos);
      this.totalAvailableWellsCount = data.count;
      this.dataSource[this.selectedTab].sort = this.sort;
    });
  }

  selectedColumn(column) {
    return this.displayedColumns.indexOf(column) > -1;
  }

  modifyDisplayedColumns(column) {
    const indexOfColumn = this.displayedColumns.indexOf(column);
    const originalIndexOfColumn = this.availableColumns.indexOf(column);
    if (indexOfColumn > -1) {
      this.displayedColumns.splice(indexOfColumn, 1);
    } else {
      this.displayedColumns.splice(originalIndexOfColumn, 0, column);
    }
  }

  filterAdvanced() {
    const dialogRef = this.dialog.open(AdvancedFilterComponent, {
      width: '750px',
      // maxWidth: 350,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: true,
      data: this.payLoadWithParams[this.selectedTab].filters ? this.payLoadWithParams[this.selectedTab].filters : ''
    });

    dialogRef.afterClosed().subscribe(result => {
      this.payLoadWithParams[this.selectedTab]['filters'] = result;
      this.fetchData(this.payLoadWithParams[this.selectedTab]);
    });
  }

  onTabChange(event) {
    switch (this.selectedTab) {
      case 0:
        this.fetchData(this.payLoadWithParams[this.selectedTab]);
        break;
      case 1:
        this.fetchMcWellDetail();
        break;
      case 2:
        this.fetchCpWellDetail();
        break;
      case 3:
        this.fetchFtWellDetail();
        break;
      case 4:
        this.fetchPfWellDetail();
        break;
      case 5:
        this.fetchSurveyWellDetail();
        break;
      case 6:
        this.fetchIpWellDetail();
        break;
    }
  }

  fetchCpWellDetail(offset = 0, limit = 5) {
    const payLoad = {
      offset,
      limit
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.CP_COLUMNS];
    }
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.apiService.fetchCpWellDetails(this.payLoadWithParams[this.selectedTab]).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellCpDtos);
      this.totalAvailableWellsCount = data.count;
      this.dataSource[this.selectedTab].sort = this.sort;
    });
  }

  fetchFtWellDetail(offset = 0, limit = 5) {
    const payLoad = {
      offset,
      limit
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.FT_COLUMNS];
    }
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.apiService.fetchFtWellDetails(payLoad).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellFtDtos);
      this.totalAvailableWellsCount = data.count;
      this.dataSource[this.selectedTab].sort = this.sort;
    });
  }

  fetchMcWellDetail(offset = 0, limit = 5) {
    const payLoad = {
      offset,
      limit
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.MC_COLUMNS];
    }
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.apiService.fetchMcWellDetails(payLoad).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellMcDtos);
      this.totalAvailableWellsCount = data.count;
      this.dataSource[this.selectedTab].sort = this.sort;
    });
  }

  fetchPfWellDetail(offset = 0, limit = 5) {
    const payLoad = {
      offset,
      limit
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.PF_COLUMNS];
    }
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.apiService.fetchPfWellDetails(payLoad).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellPfDtos);
      this.totalAvailableWellsCount = data.count;
      this.dataSource[this.selectedTab].sort = this.sort;
    });
  }

  fetchSurveyWellDetail(offset = 0, limit = 5) {
    const payLoad = {
      offset,
      limit
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.SURVEY_COLUMNS];
    }
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.apiService.fetchSurveyWellDetails(payLoad).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellSurveyDtos);
      this.totalAvailableWellsCount = data.count;
      this.dataSource[this.selectedTab].sort = this.sort;
    });
  }

  fetchIpWellDetail(offset = 0, limit = 5) {
    const payLoad = {
      offset,
      limit
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.IP_COLUMNS];
    }
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.apiService.fetchIpWellDetails(payLoad).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellIpVolumeDtos);
      this.totalAvailableWellsCount = data.count;
      this.dataSource[this.selectedTab].sort = this.sort;
    });
  }

  populateColumns(dataForTable) {

  }
}

