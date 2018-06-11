import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

    public site: any;

    constructor(private databaseService: DatabaseService) { }

    ngOnInit() {
        this.getSiteInformation();
    }

    getSiteInformation(){
        this.databaseService.getSiteInformation().subscribe(response => {
            if(response != "Not found"){
                response.adresse = response.adresse.split(",");
                this.site = response;
            }
        })
    }
}
