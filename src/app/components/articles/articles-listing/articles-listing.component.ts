import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-articles-listing',
    templateUrl: './articles-listing.component.html',
    styleUrls: ['./articles-listing.component.css']
})
export class ArticlesListingComponent implements OnInit {

    constructor(private databaseService: DatabaseService) { }

    public articles: any[];
    private unsubscribe = new Subject<void>();
    
    ngOnInit() {
        this.getAllActivatedArticles();
    }

    getAllActivatedArticles() {
		this.databaseService.getAllActivatedArticles().takeUntil(this.unsubscribe).subscribe(response => {
			if (response != 'Not found') {
				this.articles = response;
			}
		});
	}

}
