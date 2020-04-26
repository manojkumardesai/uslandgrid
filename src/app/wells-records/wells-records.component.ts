import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../_services/api.service';
import { tap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

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
  displayedColumns: string[] = [
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
    'country',
    'datumType',
    'tvd',
    'action'
  ];
  dataSource: MatTableDataSource<any>;
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
  constructor(public apiService: ApiService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.isLoading = true;
    const currentItem: SimpleChange = changes.payLoadFromFilter;
    const mapExtentValue: SimpleChange = changes.mapExtent;
    let payLoad;
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
    if (payLoad) {
      this.apiService.fetchWellsData(payLoad).subscribe((data) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(data.wellDtos);
        this.totalAvailableWellsCount = data.count;
        this.dataSource.sort = this.sort;
      });
    } else {
      payLoad = {
        offset: 0,
        limit: 5
      }
      this.apiService.fetchWellsData(payLoad).subscribe((data) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(data.wellDtos);
        this.totalAvailableWellsCount = data.count;
        this.dataSource.sort = this.sort;
      });
    }
    if (Object.keys(payLoad).length) {
      Object.assign(this.payLoadWithParams, payLoad);
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
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
      this.apiService.fetchWellsData(payLoad).subscribe((data) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(data.wellDtos);
        this.totalAvailableWellsCount = data.count;
        this.dataSource.sort = this.sort;
      });
    } else {
      this.apiService.fetchWellsData({ offset, limit }).subscribe((data) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(data.wellDtos);
        this.totalAvailableWellsCount = data.count;
        this.dataSource.sort = this.sort;
      });
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
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
    this.fetchData(this.payLoadWithParams);
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
    this.apiService.fetchWellsData(payLoad).subscribe((data) => {
      this.isLoading = false;
      this.dataSource = new MatTableDataSource(data.wellDtos);
      this.totalAvailableWellsCount = data.count;
      this.dataSource.sort = this.sort;
    });
  }
}

