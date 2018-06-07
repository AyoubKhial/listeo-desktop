import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { PagerService } from '../../../services/pager/pager.service';

@Component({
    selector: 'app-articles-listing',
    templateUrl: './articles-listing.component.html',
    styleUrls: ['./articles-listing.component.css']
})
export class ArticlesListingComponent implements OnInit {

    constructor(private databaseService: DatabaseService, private pagerService: PagerService) { }

    public articles: any[];
    public pager: any = {};
	public pagedArticles: any[];
    private unsubscribe = new Subject<void>();
    
    ngOnInit() {
        this.getAllActivatedArticles();
    }

    getAllActivatedArticles() {
		this.databaseService.getAllActivatedArticles().takeUntil(this.unsubscribe).subscribe(response => {
			if (response != 'Not found') {
                this.articles = response;
                this.setPage(1);
			}
		});
    }
    
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.articles.length, page, 3);
        this.pagedArticles = this.articles.slice(this.pager.startIndex, this.pager.endIndex + 1);
	}

}
