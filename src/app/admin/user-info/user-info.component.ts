import { OnInit, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoginService } from "../../_services/login.service";
import { ApiService } from "../../_services/api.service";
import { Location } from '@angular/common';

@Component({
    selector: 'user-info',
    templateUrl: './user.info-component.html',
    styleUrls: ['./user.info-component.scss']
})

export class UserInfoComponent implements OnInit {
    id: number;
    sub: any;
    user: any;
    countrieslist: any;
    isSuccess: boolean = false;
    isFailure: boolean = false;
    message: string = ""
    tables = ['WELL RECORDS', 'COMPLETION', 'CASING', 'FORMATION', 'PERFORATION', 'SURVEY', 'INITIAL POTENTIAL'];
    reportTypes = ['shp', 'wb2', 'wb4', 'csv', 'xlsx'];

    constructor(private _activateRoute: ActivatedRoute,
        private _loginService: LoginService,
        private _apiservice: ApiService,
        private _location: Location) {

    }

    ngOnInit() {
        this.sub = this._activateRoute.params.subscribe(params => {
            this.id = +params['id'];
            this._apiservice.userDetails(this.id).subscribe(data => {
                this.user = data;
                this.countries();
            });
        });
    }

    countries() {
        this._apiservice.fetchCounties().subscribe(data => {
            this.countrieslist = data;
        });
    }

    isCountyAlloted(name) {
        return this.user['userPermissionDto'].counties.includes(name) ? true : false;
    }

    addOrRemovedCounty(name) {
        let index = this.user['userPermissionDto'].counties.indexOf(name);
        if (this.user['userPermissionDto'].counties.includes(name)) {
            this.user['userPermissionDto'].counties.splice(index, 1)
        } else {
            this.user['userPermissionDto'].counties.push(name);
        }
    }

    selectAllCounty() {
        if (this.countrieslist.every(county => this.user['userPermissionDto'].counties.includes(county))) {
            this.user['userPermissionDto'].counties = [];
        } else {
            this.user['userPermissionDto'].counties = this.countrieslist;
        }
    }

    isAllCountySelected() {
        return this.countrieslist && this.countrieslist.every(county => this.user['userPermissionDto'].counties.includes(county));
    }

    isReportAllocated(name) {
        return this.user['userPermissionDto'].reportTypes.includes(name.toLowerCase()) ? true : false;
    }

    addOrRemoveReportType(name) {
        let index = this.user['userPermissionDto'].reportTypes.indexOf(name.toLowerCase());
        if (this.user['userPermissionDto'].reportTypes.includes(name.toLowerCase())) {
            this.user['userPermissionDto'].reportTypes.splice(index, 1)
        } else {
            this.user['userPermissionDto'].reportTypes.push(name.toLowerCase());
        }
    }

    selectAllReports() {
        if (this.reportTypes.every(report => this.user['userPermissionDto'].reportTypes.includes(report))) {
            this.user['userPermissionDto'].reportTypes = [];
        } else {
            this.user['userPermissionDto'].reportTypes = this.reportTypes;
        }
    }

    isAllReportsSelected() {
        return this.reportTypes.every(report => this.user['userPermissionDto'].reportTypes.includes(report));
    }

    isTablesAllocated(name) {
        return this.user['userPermissionDto'].tables.includes(name) ? true : false;
    }

    addOrRemoveTables(name) {
        let index = this.user['userPermissionDto'].tables.indexOf(name);
        if (this.user['userPermissionDto'].tables.includes(name)) {
            this.user['userPermissionDto'].tables.splice(index, 1)
        } else {
            this.user['userPermissionDto'].tables.push(name);
        }
    }

    selectAllTables() {
        if (this.tables.every(table => this.user['userPermissionDto'].tables.includes(table))) {
            this.user['userPermissionDto'].tables = [];
        } else {
            this.user['userPermissionDto'].tables = this.tables;
        }
    }

    isAllTableSelected() {
        return this.tables.every(table => this.user['userPermissionDto'].tables.includes(table));
    }

    updateUser() {
        this._apiservice.updateUser(this.user).subscribe(data => {
            if (data['statusCode'] == 200) {
                this.isSuccess = true;
                this.message = data['message'];
            }
        })
    }

    goBack(): void {
        this._location.back();
    }

    stopCloseDropdown($event) {
        $event.stopPropagation();
    }
}