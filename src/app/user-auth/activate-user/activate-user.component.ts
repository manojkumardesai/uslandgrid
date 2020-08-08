import { OnInit, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../_services/api.service";

@Component({
    selector: 'activate-user',
    templateUrl: './activate-user.component.html',
    styleUrls: ['./activate-user.component.scss']
})

export class ActivateUser implements OnInit {
    isSuccess: boolean = false;
    isFailed: boolean = false;
    message: string = '';
    token: string;
    sub: any;

    constructor(private _activateRoute: ActivatedRoute, private _apiservice: ApiService,
        private router: Router) {

    }

    ngOnInit() {
        this.sub = this._activateRoute.queryParams.subscribe(params => {
            this.token = params['activateToken'];
        });
    }

    activateUser() {
        let payload = {};
        payload['activateToken'] = this.token;
        this._apiservice.activateUser(payload).subscribe(data => {
            if (data['statusCode'] == 200) {
                this.message = data['message'];
                this.isSuccess = true;
                setTimeout(() => {
                    this.router.navigate(['user-auth/login']);
                }, 1500);

            }
            if (data['statusCode'] == 400) {
                this.message = data['message'];
                this.isFailed = true;
                setTimeout(() => {
                    this.router.navigate(['user-auth/login']);
                }, 1500);

            }

        });
    }
}