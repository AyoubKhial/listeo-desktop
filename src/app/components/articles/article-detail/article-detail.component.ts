import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DatabaseService } from '../../../services/database/database.service';
import { ActivatedRoute } from '@angular/router';
import { PagerService } from '../../../services/pager/pager.service';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-article-detail',
    templateUrl: './article-detail.component.html',
    styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {

    private articleId: number;
    public article;
    private unsubscribe = new Subject<void>();
    public comments: any[];
    public pager: any = {};
    public pagedComments: any[];

    constructor(private activatedRoute: ActivatedRoute, private databaseService: DatabaseService, private pagerService: PagerService) {
    }

    ngOnInit() {
        this.getArticleId();
        this.getArticleDetails();
    }

    getArticleId() {
        this.activatedRoute.params.subscribe((params: ParameterDecorator) => {
            this.articleId = params['id'];
        });
    }
    x;
    getArticleDetails() {
        this.databaseService.getArticleDetails(this.articleId).takeUntil(this.unsubscribe).subscribe(response => {
            if (response != 'Not found') {
                this.article = response[0];
            }
        });
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.comments.length, page, 4);
        this.pagedComments = this.comments.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    getStars(rating) {
        return { 'width': parseFloat(rating) / 5 * 100 + '%' };
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
