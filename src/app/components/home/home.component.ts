import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    public locations : object;
    public articles;

    constructor(private databaseService: DatabaseService) { }

    ngOnInit() {
        this.getTopRatedLocations();
        this.getLastArticles();
    }

    getTopRatedLocations(){
        this.databaseService.getTopRatedLocations().subscribe(response => {
            this.locations = response;
        })
    }

    getLastArticles(){
        this.databaseService.getLastArticles().subscribe(response => {
            for(var i = 0 ; i< response.length ; i++){
                response[i].texte = response[i].texte.replace(/(<([^>]+)>)/ig,"")
            }
            this.articles = response;
            console.log(this.articles);
        });
        
    }
}
