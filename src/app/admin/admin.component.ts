import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../_services/api.service";
import { Router } from "@angular/router";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})


export class AdminComponent implements OnInit {
    users: any = [];
    count: number = 0;
    searchKey: string = '';
    displayedColumns  = ['ind', 'id', 'firstName', 'lastName', 'emailAddress', 'status', 'subscribeValid', 'actions'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource = new MatTableDataSource([])
    constructor(private _apiService: ApiService, private _router: Router) {
    }

    ngOnInit() {
        this.getListOfUser();
    }

    getListOfUser() {
        this._apiService.getListOfUser().subscribe((data) => {
            this.users = data['users'];
            this.dataSource = new MatTableDataSource(this.users);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.users = this.users.sort((a, b) => a['id'] < b['id'] ? 1 : -1);
            this.count = data['count'];
        });
    }

    searchUser() {
        this._apiService.search(this.searchKey).subscribe((data) => {
            this.users = data['users'];
            this.users = this.users.sort((a, b) => a['id'] < b['id'] ? 1 : -1);
            this.count = data['count'];
        })
    }

    gotoUser(id) {
        this._router.navigate(['/user-info/', id]);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
}