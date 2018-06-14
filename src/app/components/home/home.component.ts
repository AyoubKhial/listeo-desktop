import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    public locations: object;
    public articles;
    private isLoggedIn: boolean;
    private userId: number;

    constructor(private databaseService: DatabaseService, private session: SessionStorageService) {
        this.isLoggedIn = false;
        this.userId = 0;
    }

    ngOnInit() {
        if (this.session.retrieve("login") != null){
            this.isLoggedIn = true;
            this.userId = this.session.retrieve("login").id;
        }
        this.getTopRatedLocations();
        this.getLastArticles();
    }

    getTopRatedLocations() {
        var user = null;
        if(this.isLoggedIn){
            user = this.session.retrieve("login").id;
        }
        this.databaseService.getTopRatedLocations(user).subscribe(response => {
            this.locations = response;
        })
    }

    getLastArticles() {
        this.databaseService.getLastArticles().subscribe(response => {
            for (var i = 0; i < response.length; i++) {
                response[i].texte = response[i].texte.replace(/(<([^>]+)>)/ig, "")
            }
            this.articles = response;
        });
    }

    addOrRemoveFromFavoris(event, id) {
        if (this.userId != 0) {
            var data = {
                item: id,
                user: this.userId,
                action: null
            }
            if (event.target.classList.length == 2) {
                data.action = "remove";
                this.databaseService.addToFavoris(data).subscribe();
            }
            else {
                data.action = "add";
                this.databaseService.addToFavoris(data).subscribe();
            }
        }
    }
}
