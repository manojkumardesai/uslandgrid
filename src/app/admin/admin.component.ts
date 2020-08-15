import { Component, OnInit } from "@angular/core";
import { ApiService } from "../_services/api.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})


export class AdminComponent implements OnInit {
    users: any = [];
    count: number = 0;
    constructor(private _apiService: ApiService, private _router: Router) {

    }




    ngOnInit() {
        this.getListOfUser();
    }

    getListOfUser() {
        this._apiService.getListOfUser().subscribe((data) => {
            this.users = data['users'];
            this.users = this.users.sort((a, b) => a['id'] < b['id'] ? 1 : -1);
            this.count = data['count'];
        });
    }

    gotoUser(id) {
        this._router.navigate(['/user-info/', id]);
    }
}