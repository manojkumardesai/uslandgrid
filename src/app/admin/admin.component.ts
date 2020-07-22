import { Component, OnInit } from "@angular/core";
import { ApiService } from "../_services/api.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})


export class AdminComponent implements OnInit {

    constructor(private _apiService: ApiService, private _router: Router) {

    }

    users: any = [];

    ngOnInit() {
        this.getListOfUser();
    }

    getListOfUser() {
        this._apiService.getListOfUser().subscribe((data) => this.users = data);
    }

    gotoUser(id) {
        this._router.navigate(['/user-info/', id]);
    }
}