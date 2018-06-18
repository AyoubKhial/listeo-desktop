import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { SessionStorageService } from 'ngx-webstorage';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import { PagerService } from '../../../services/pager/pager.service';

@Component({
    selector: 'app-bookmarks',
    templateUrl: './bookmarks.component.html',
    styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit, OnDestroy {

    private userId: number;
    public items: any[];
    public pager: any = {};
    public pagedItems: any[];
    public notFound: boolean;
    private unsubscribe = new Subject<void>();

    constructor(private databaseService: DatabaseService,
        private session: SessionStorageService,
        private pagerService: PagerService) { 
        this.notFound = false;
    }

    ngOnInit() {
        this.userId = this.session.retrieve("login").id;
        this.getBookmarks();
    }

    getBookmarks(){
        this.databaseService.getBookmarks(this.userId).takeUntil(this.unsubscribe).subscribe(response => {
            if(response != "Not found"){
                this.items = response;
                this.setPage(1);
            }
            else{
                this.notFound = true;
            }
        })
    }

    removeBookmark(id){
        var data = {
            item: id,
            user: this.userId,
            action: "remove"
        }
        this.databaseService.addToFavoris(data).takeUntil(this.unsubscribe).subscribe(response => {
            if(response == "Inserted"){
                this.getBookmarks();
            }
        });
    }

    getStars(rating) {
        return { 'width': parseFloat(rating) / 5 * 100 + '%' };
    }

    setPage(page: number, target?) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.items.length, page, 6);
        this.pagedItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);
        if(target)
        target.scrollIntoView({ behavior: "smooth" });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
