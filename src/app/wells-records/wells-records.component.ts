import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../_services/api.service';
import { tap } from 'rxjs/operators';

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
  totalAvailableWellsCount: any;
  displayedColumns: string[] = [
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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public apiService: ApiService) { }

  ngOnChanges(changes: SimpleChanges) {
    const currentItem: SimpleChange = changes.payLoadFromFilter;
    if(currentItem.currentValue) {
      this.apiService.fetchWellsByPayLoad(this.payLoadFromFilter, 0, 5).subscribe((data) => {
        this.dataSource = new MatTableDataSource(data.wellDtos);
      });
    } else {
      this.apiService.fetchWellsData(0, 5).subscribe((data) => {
        this.dataSource = new MatTableDataSource(data.wellDtos);
        this.totalAvailableWellsCount = data.count;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }
  ngOnInit() {
    console.log(this.payLoadFromFilter);
    this.apiService.fetchWellsData(0, 5).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data.wellDtos);
      this.totalAvailableWellsCount = data.count;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

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

  loadWells(offset=0, limit=0) {
    this.apiService.fetchWellsData(offset, limit).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data.wellDtos);
    });
  }
}

