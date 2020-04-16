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
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<any>(true, []);
  constructor(public apiService: ApiService) { }

  ngOnChanges(changes: SimpleChanges) {
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
        this.dataSource = new MatTableDataSource(data.wellDtos);
        this.totalAvailableWellsCount = data.count;
        this.dataSource.sort = this.sort;
      });
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

  loadWells(offset = 0, limit = 0) {
    if (Object.keys(this.payLoadFromFilter).length) {
      const payLoad = {
        offset,
        limit,
        wellsCriteria: this.payLoadFromFilter
      }
      this.apiService.fetchWellsData(payLoad).subscribe((data) => {
        this.dataSource = new MatTableDataSource(data.wellDtos);
        this.totalAvailableWellsCount = data.count;
        this.dataSource.sort = this.sort;
      });
    } else {
      this.apiService.fetchWellsData({ offset, limit }).subscribe((data) => {
        this.dataSource = new MatTableDataSource(data.wellDtos);
        this.totalAvailableWellsCount = data.count;
        this.dataSource.sort = this.sort;
      });
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
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
    this.filterByExtent.emit('true');
  }

  clear() {
    this.clearSelection.emit('true');
    this.masterToggle();
  }

  refreshEmit() {
    this.refresh.emit('true');
    this.masterToggle();
  }

  zoomToEmit() {
    if (this.selection.selected.length) {
      this.zoomTo.emit(this.selection.selected);
    }
  }
}

