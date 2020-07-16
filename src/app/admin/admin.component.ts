import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})


export class AdminComponent implements OnInit {

    users = [
        { id: 1, first_name: 'Adam', last_name: 'Smith', email: 'adam@uslandgrid.com' },
        { id: 2, first_name: 'Smith', last_name: 'Smith', email: 'smith@uslandgrid.com' },
        { id: 3, first_name: 'Gill', last_name: 'Smith', email: 'gill@uslandgrid.com' },
        { id: 4, first_name: 'John', last_name: 'Smith', email: 'john@uslandgrid.com' },
        { id: 5, first_name: 'Emma', last_name: 'Smith', email: 'emma@uslandgrid.com' },
        { id: 6, first_name: 'Oliva', last_name: 'Smith', email: 'oliva@uslandgrid.com' },
        { id: 7, first_name: 'Isabella', last_name: 'Smith', email: 'isabella@uslandgrid.com' },
        { id: 8, first_name: 'Denial', last_name: 'Smith', email: 'denial@uslandgrid.com' },
        { id: 9, first_name: 'Henry', last_name: 'Smith', email: 'henry@uslandgrid.com' },
        { id: 10, first_name: 'Jacob', last_name: 'Smith', email: 'jacob@uslandgrid.com' },
        { id: 1, first_name: 'Adam', last_name: 'Smith', email: 'adam@uslandgrid.com' },
        { id: 2, first_name: 'Smith', last_name: 'Smith', email: 'smith@uslandgrid.com' },
        { id: 3, first_name: 'Gill', last_name: 'Smith', email: 'gill@uslandgrid.com' },
        { id: 4, first_name: 'John', last_name: 'Smith', email: 'john@uslandgrid.com' },
        { id: 5, first_name: 'Emma', last_name: 'Smith', email: 'emma@uslandgrid.com' },
        { id: 6, first_name: 'Oliva', last_name: 'Smith', email: 'oliva@uslandgrid.com' },
        { id: 7, first_name: 'Isabella', last_name: 'Smith', email: 'isabella@uslandgrid.com' },
        { id: 8, first_name: 'Denial', last_name: 'Smith', email: 'denial@uslandgrid.com' },
        { id: 9, first_name: 'Henry', last_name: 'Smith', email: 'henry@uslandgrid.com' },
        { id: 10, first_name: 'Jacob', last_name: 'Smith', email: 'jacob@uslandgrid.com' },
    ];

    ngOnInit() {

    }
}