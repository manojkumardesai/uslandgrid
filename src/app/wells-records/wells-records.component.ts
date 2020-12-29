import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, SimpleChange, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
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
  totalAvailableWellsCount = [];
  displayedColumns = [];
  availableColumns = [];
  public wellDetailsMC: MatTableDataSource<any>;
  public wellDetailsCP: MatTableDataSource<any>;
  public wellDetailsPF: MatTableDataSource<any>;
  public wellDetailsFT: MatTableDataSource<any>;
  public wellDetailsSurvey: MatTableDataSource<any>;
  public wellDetailsIP: MatTableDataSource<any>;
  dataSource = [];
  @Input() payLoadFromFilter: any;
  @Input() mapExtent: any;
  @Input() openAdvancedFilter: boolean;
  @Output() openAdvancedFilterEvent = new EventEmitter();
  @Output() filterByExtent = new EventEmitter();
  @Output() zoomTo = new EventEmitter();
  @Output() clearSelection = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() selectedRowEmit = new EventEmitter();
  @Input() mapTownShipExtent: any;
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  // @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<any>(true, []);
  filterByMapExtentFlag: boolean;
  isLoading: boolean;
  payLoadWithParams: any = {};
  selectedTab = 0;
  titleForReset = 'Applied filters will be reset.';
  subscription: any = [];
  townShipData: any;
  constructor(public apiService: ApiService,
    public dialog: MatDialog,
    public columnConstants: ColumnConstantsService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.isLoading = true;
    const currentItem: SimpleChange = changes.payLoadFromFilter;
    const mapExtentValue: SimpleChange = changes.mapExtent;
    const townshipExtent: SimpleChange = changes.mapTownShipExtent;
    if (changes.openAdvancedFilter && changes.openAdvancedFilter.currentValue) {
      this.filterAdvanced();
    }
    let payLoad: any = {
      offset: 0,
      limit: 10,
      points: [],
      wellsCriteria: []
    };
    if (currentItem && Object.keys(currentItem.currentValue).length) {
      payLoad = {
        offset: 0,
        limit: 10,
        wellsCriteria: this.payLoadFromFilter
      };
    }
    if (mapExtentValue && mapExtentValue.currentValue.length) {
      payLoad = {
        offset: 0,
        limit: 10,
        points: this.mapExtent
      };

    }
    if (townshipExtent && townshipExtent.currentValue && Object.keys(townshipExtent.currentValue).length) {
      payLoad = {
        offset: 0,
        limit: 10,
        plssFilterDto: townshipExtent.currentValue
      };
      delete payLoad.points;
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[0] = {};
      this.payLoadWithParams[1] = {};
      this.payLoadWithParams[2] = {};
      this.payLoadWithParams[3] = {};
      this.payLoadWithParams[4] = {};
      this.payLoadWithParams[5] = {};
      this.payLoadWithParams[6] = {};
    }
    if (Object.keys(payLoad).length) {
      Object.assign(this.payLoadWithParams[0], payLoad);
      Object.assign(this.payLoadWithParams[1], payLoad);
      Object.assign(this.payLoadWithParams[2], payLoad);
      Object.assign(this.payLoadWithParams[3], payLoad);
      Object.assign(this.payLoadWithParams[4], payLoad);
      Object.assign(this.payLoadWithParams[5], payLoad);
      Object.assign(this.payLoadWithParams[6], payLoad);

      for (let i = 0; i < Object.keys(this.payLoadWithParams).length; i++) {
        if (townshipExtent && townshipExtent.currentValue && Object.keys(townshipExtent.currentValue).length) {
          delete this.payLoadWithParams[i].points;
        } else {
          delete this.payLoadWithParams[i].plssFilterDto;
        }
      }
    }
    if (Object.keys(this.payLoadWithParams[this.selectedTab]).length) {
      this.onTabChange();
    }
  }
  ngOnInit() {
    this.payLoadWithParams[0] = {};
    this.payLoadWithParams[1] = {};
    this.payLoadWithParams[2] = {};
    this.payLoadWithParams[3] = {};
    this.payLoadWithParams[4] = {};
    this.payLoadWithParams[5] = {};
    this.payLoadWithParams[6] = {};
    this.fetchData();

    /* Subscription on map extent changes */
    this.subscription.push(
      this.apiService.mapExtentSubject.subscribe(val => {
        const points = {
          points: val
        };
        this.formatPayload(points, 'plssFilterDto');
        this.formatPayload(points, 'filters');
        this.onTabChange();
      })
    );

    /* Subscription on township changes */
    this.subscription.push(
      this.apiService.mapExtentTownshipSubject.subscribe(val => {
        const plssFilterDto = {
          plssFilterDto: val
        };
        this.formatPayload(plssFilterDto, 'points');
        this.formatPayload(plssFilterDto, 'filters');
        this.onTabChange();
      })
    );

    /* open advance filter menu */
    this.subscription.push(
      this.apiService.openAdvanceFilter.subscribe(val => {
        if (val) {
          this.filterAdvanced();
        }
      })
    );

    /* Subscription on filtered values */
    this.subscription.push(
      this.apiService.filteredSubject.subscribe(val => {
        const filters = {
          filters: val
        };
        this.formatPayload(filters);
        this.onTabChange();
      })
    );

    this.subscription.push(
      this.apiService.resetTableSubject.subscribe(val => {
        this.formatPayload({}, 'plssFilterDto')
        this.formatPayload({}, 'points');
        this.formatPayload({}, 'filters');
        this.onTabChange();
      })
    );
  }

  formatPayload(payload?, deleteKey?) {
    Object.assign(this.payLoadWithParams[0], payload);
    Object.assign(this.payLoadWithParams[1], payload);
    Object.assign(this.payLoadWithParams[2], payload);
    Object.assign(this.payLoadWithParams[3], payload);
    Object.assign(this.payLoadWithParams[4], payload);
    Object.assign(this.payLoadWithParams[5], payload);
    Object.assign(this.payLoadWithParams[6], payload);
    for (let i = 0; i < 7; i++) {
      if (deleteKey === 'points') {
        delete this.payLoadWithParams[i][deleteKey];
      }
      if (deleteKey === 'plssFilterDto') {
        delete this.payLoadWithParams[i][deleteKey];
      }
      if (deleteKey === 'filters') {
        delete this.payLoadWithParams[i][deleteKey];
      }
    }
  }

  ngAfterViewInit() {
    this.paginator.toArray()[0].page
      .pipe(
        tap(() => this.onTabChange(this.paginator.toArray()[0].pageIndex, this.paginator.toArray()[0].pageSize))
      )
      .subscribe();
    this.paginator.toArray()[1].page
      .pipe(
        tap(() => this.onTabChange(this.paginator.toArray()[1].pageIndex, this.paginator.toArray()[1].pageSize))
      )
      .subscribe();
    this.paginator.toArray()[2].page
      .pipe(
        tap(() => this.onTabChange(this.paginator.toArray()[2].pageIndex, this.paginator.toArray()[2].pageSize))
      )
      .subscribe();
    this.paginator.toArray()[3].page
      .pipe(
        tap(() => this.onTabChange(this.paginator.toArray()[3].pageIndex, this.paginator.toArray()[3].pageSize))
      )
      .subscribe();
    this.paginator.toArray()[4].page
      .pipe(
        tap(() => this.onTabChange(this.paginator.toArray()[4].pageIndex, this.paginator.toArray()[4].pageSize))
      )
      .subscribe();
    this.paginator.toArray()[5].page
      .pipe(
        tap(() => this.onTabChange(this.paginator.toArray()[5].pageIndex, this.paginator.toArray()[5].pageSize))
      )
      .subscribe();
    this.paginator.toArray()[6].page
      .pipe(
        tap(() => this.onTabChange(this.paginator.toArray()[6].pageIndex, this.paginator.toArray()[6].pageSize))
      )
      .subscribe();
  }

  loadWells(offset = 0, limit = 10) {
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
      this.fetchData(offset, limit);
    } else {
      const payLoad = {
        offset,
        limit
      }
      if (Object.keys(payLoad).length) {
        Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
      }
      this.fetchData(offset, limit);
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
    this.apiService.loadTableByMapExtent(true);
    this.selection.clear();
    this.apiService.clearTabPoints(true);
  }

  clear() {
    this.apiService.clearTabPoints(true);
    this.selection.clear();
  }

  refreshEmit() {
    this.refresh.emit('true');
    this.selection.clear();
    this.deleteKeyFromAllObj('filters');
    this.onTabChange();
    this.apiService.resetAdvanceFilter(true);
  }

  zoomToEmit() {
    if (this.selection.selected.length) {
      // this.zoomTo.emit(this.selection.selected);
      this.apiService.loadZoomTo(this.selection.selected);
    }
  }

  rowToggle($event) {
    if ($event.checked) {
      this.selectedRowEmit.emit(this.selection.selected[0]);
    } else {
      this.selectedRowEmit.emit(null);
    }
  }

  fetchData(offset = 0, limit = 10) {
    const payLoad = {
      offset,
      limit
    }
    this.clear();
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.isLoading = true;
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.WELL_RECORD_COLUMNS];
    }
    this.apiService.fetchWellsData(this.payLoadWithParams[this.selectedTab]).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellDtos);
      // this.dataSource[this.selectedTab].paginator = this.paginator.toArray()[this.selectedTab];
      this.dataSource[this.selectedTab].sort = this.sort.toArray()[this.selectedTab];
      this.totalAvailableWellsCount[this.selectedTab] = data.count;
      if (data.wellDtos && data.wellDtos.length) {
        this.availableColumns[this.selectedTab] = Object.keys(data.wellDtos[0]);
      }
    },
      (err) => {
        this.apiService.hide();
      });
  }

  selectedColumn(column) {
    return this.displayedColumns[this.selectedTab].indexOf(column) > -1;
  }

  modifyDisplayedColumns(column) {
    const indexOfColumn = this.displayedColumns[this.selectedTab].indexOf(column);
    const originalIndexOfColumn = this.availableColumns[this.selectedTab].indexOf(column);
    if (indexOfColumn > -1) {
      this.displayedColumns[this.selectedTab].splice(indexOfColumn, 1);
    } else {
      this.displayedColumns[this.selectedTab].splice(originalIndexOfColumn, 0, column);
    }
  }

  filterAdvanced($event?) {
    const dialogRef = this.dialog.open(AdvancedFilterComponent, {
      width: '600px',
      // maxWidth: 350,
      backdropClass: 'filter-panel-backdrop',
      hasBackdrop: true,
      autoFocus: false,
      panelClass: 'filter-panel',
      data: this.payLoadWithParams[this.selectedTab].filters ? this.payLoadWithParams[this.selectedTab].filters : ''
    });

    dialogRef.afterClosed().subscribe(result => {
      this.payLoadWithParams[0]['filters'] = result;
      this.payLoadWithParams[1]['filters'] = result;
      this.payLoadWithParams[2]['filters'] = result;
      this.payLoadWithParams[3]['filters'] = result;
      this.payLoadWithParams[4]['filters'] = result;
      this.payLoadWithParams[5]['filters'] = result;
      this.payLoadWithParams[6]['filters'] = result;
      this.formatPayload('', 'points');
      this.formatPayload('', 'plssFilterDto');
      this.openAdvancedFilterEvent.emit(false);
      this.onTabChange();
    });
  }

  onTabChange(offset = 0, limit = 10) {
    this.isLoading = true;
    this.clear();
    switch (this.selectedTab) {
      case 0:
        this.fetchData(offset, limit);
        break;
      case 1:
        this.fetchCpWellDetail(offset, limit);
        break;
      case 2:
        this.fetchMcWellDetail(offset, limit);
        break;
      case 3:
        this.fetchFtWellDetail(offset, limit);
        break;
      case 4:
        this.fetchPfWellDetail(offset, limit);
        break;
      case 5:
        this.fetchSurveyWellDetail(offset, limit);
        break;
      case 6:
        this.fetchIpWellDetail(offset, limit);
        break;
    }
  }

  fetchCpWellDetail(offset = 0, limit = 10) {
    const payLoad = {
      offset,
      limit
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.CP_COLUMNS].slice(0, 10);
    }
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.apiService.fetchCpWellDetails(this.payLoadWithParams[this.selectedTab]).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellCpDtos);
      this.totalAvailableWellsCount[this.selectedTab] = data.count;
      // this.dataSource[this.selectedTab].paginator = this.paginator.toArray()[this.selectedTab];
      this.dataSource[this.selectedTab].sort = this.sort.toArray()[this.selectedTab];
      if (data.wellCpDtos && data.wellCpDtos.length) {
        this.availableColumns[this.selectedTab] = Object.keys(data.wellCpDtos[0]);
      }
    },
      (err) => {
        this.apiService.hide();
      });
  }

  fetchFtWellDetail(offset = 0, limit = 10) {
    const payLoad = {
      offset,
      limit
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.FT_COLUMNS].slice(0, 10);
    }
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.apiService.fetchFtWellDetails(this.payLoadWithParams[this.selectedTab]).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellFtDtos);
      this.totalAvailableWellsCount[this.selectedTab] = data.count;
      // this.dataSource[this.selectedTab].paginator = this.paginator.toArray()[this.selectedTab];
      this.dataSource[this.selectedTab].sort = this.sort.toArray()[this.selectedTab];
      if (data.wellFtDtos && data.wellFtDtos.length) {
        this.availableColumns[this.selectedTab] = Object.keys(data.wellFtDtos[0]);
      }
    },
      (err) => {
        this.apiService.hide();
      });
  }

  fetchMcWellDetail(offset = 0, limit = 10) {
    const payLoad = {
      offset,
      limit
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.MC_COLUMNS].slice(0, 10);
    }
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.apiService.fetchMcWellDetails(this.payLoadWithParams[this.selectedTab]).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellMcDtos);
      this.totalAvailableWellsCount[this.selectedTab] = data.count;
      // this.dataSource[this.selectedTab].paginator = this.paginator.toArray()[this.selectedTab];
      this.dataSource[this.selectedTab].sort = this.sort.toArray()[this.selectedTab];
      if (data.wellMcDtos && data.wellMcDtos.length) {
        this.availableColumns[this.selectedTab] = Object.keys(data.wellMcDtos[0]);
      }
    },
      (err) => {
        this.apiService.hide();
      });
  }

  fetchPfWellDetail(offset = 0, limit = 10) {
    const payLoad = {
      offset,
      limit
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.PF_COLUMNS].slice(0, 10);
    }
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.apiService.fetchPfWellDetails(this.payLoadWithParams[this.selectedTab]).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellPfDtos);
      this.totalAvailableWellsCount[this.selectedTab] = data.count;
      // this.dataSource[this.selectedTab].paginator = this.paginator.toArray()[this.selectedTab];
      this.dataSource[this.selectedTab].sort = this.sort.toArray()[this.selectedTab];
      if (data.wellPfDtos && data.wellPfDtos.length) {
        this.availableColumns[this.selectedTab] = Object.keys(data.wellPfDtos[0]);
      }

    },
      (err) => {
        this.apiService.hide();
      });
  }

  fetchSurveyWellDetail(offset = 0, limit = 10) {
    const payLoad = {
      offset,
      limit
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.SURVEY_COLUMNS].slice(0, 10);
    }
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.apiService.fetchSurveyWellDetails(this.payLoadWithParams[this.selectedTab]).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellSurveyDtos);
      this.totalAvailableWellsCount[this.selectedTab] = data.count;
      // this.dataSource[this.selectedTab].paginator = this.paginator.toArray()[this.selectedTab];
      this.dataSource[this.selectedTab].sort = this.sort.toArray()[this.selectedTab];
      if (data.wellSurveyDtos && data.wellSurveyDtos.length) {
        this.availableColumns[this.selectedTab] = Object.keys(data.wellSurveyDtos[0]);
      }
    },
      (err) => {
        this.apiService.hide();
      });
  }

  fetchIpWellDetail(offset = 0, limit = 10) {
    const payLoad = {
      offset,
      limit
    }
    if (!this.payLoadWithParams[this.selectedTab]) {
      this.payLoadWithParams[this.selectedTab] = {};
    }
    if (!this.displayedColumns[this.selectedTab]) {
      this.displayedColumns[this.selectedTab] = [...this.columnConstants.IP_COLUMNS].slice(0, 10);
    }
    Object.assign(this.payLoadWithParams[this.selectedTab], payLoad);
    this.apiService.fetchIpWellDetails(this.payLoadWithParams[this.selectedTab]).subscribe((data) => {
      this.isLoading = false;
      this.dataSource[this.selectedTab] = new MatTableDataSource(data.wellIpVolumeDtos);
      this.totalAvailableWellsCount[this.selectedTab] = data.count;
      // this.dataSource[this.selectedTab].paginator = this.paginator.toArray()[this.selectedTab];
      this.dataSource[this.selectedTab].sort = this.sort.toArray()[this.selectedTab];
      if (data.wellIpVolumeDtos && data.wellIpVolumeDtos.length) {
        this.availableColumns[this.selectedTab] = Object.keys(data.wellIpVolumeDtos[0]);
      }

    },
      (err) => {
        this.apiService.hide();
      });
  }

  populateColumns(dataForTable) {

  }

  deleteKeyFromAllObj(valueToDelete) {
    delete this.payLoadWithParams[0][valueToDelete];
    delete this.payLoadWithParams[1][valueToDelete];
    delete this.payLoadWithParams[2][valueToDelete];
    delete this.payLoadWithParams[3][valueToDelete];
    delete this.payLoadWithParams[4][valueToDelete];
    delete this.payLoadWithParams[5][valueToDelete];
    delete this.payLoadWithParams[6][valueToDelete];
  }
}

