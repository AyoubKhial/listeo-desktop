import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-bookmarks',
    templateUrl: './bookmarks.component.html',
    styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {

    private userId: number;
    public items;
    constructor(private databaseService: DatabaseService, private session: SessionStorageService) { }

    ngOnInit() {
        if(this.session.retrieve("login") != null){
            this.userId = this.session.retrieve("login").id;
        }
        this.getBookmarks();
    }

    getBookmarks(){
        this.databaseService.getBookmarks(this.userId).subscribe(response => {
            if(response != "Not found"){
                this.items = response;
            }
        })
    }

    removeBookmark(id){
        var data = {
            item: id,
            user: this.userId,
            action: "remove"
        }
        this.databaseService.addToFavoris(data).subscribe(response => {
            if(response == "Inserted"){
                this.getBookmarks();
            }
        });
    }

    getStars(rating) {
        return { 'width': parseFloat(rating) / 5 * 100 + '%' };
    }
}
