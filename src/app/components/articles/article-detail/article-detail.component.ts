import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DatabaseService } from '../../../services/database/database.service';
import { ActivatedRoute } from '@angular/router';
import { PagerService } from '../../../services/pager/pager.service';
import 'rxjs/add/operator/takeUntil';
import { SessionStorageService } from 'ngx-webstorage';
import { ShareButtons } from '@ngx-share/core';

@Component({
    selector: 'app-article-detail',
    templateUrl: './article-detail.component.html',
    styleUrls: ['./article-detail.component.css']
})

export class ArticleDetailComponent implements OnInit {

    private articleId: number;
    public article;
    private unsubscribe = new Subject<void>();
    private comments: any[];
    public pager: any = {};
    public pagedComments: any[];
    public isLoggedIn: boolean;
    public isSuccess: boolean;
    @ViewChild('commentTexte') commentTexte;

    constructor(private activatedRoute: ActivatedRoute,
        private databaseService: DatabaseService,
        private pagerService: PagerService,
        private session: SessionStorageService,
        public share: ShareButtons) {
            this.isLoggedIn = false;
            this.isSuccess = true;
    }

    ngOnInit() {
        if (this.session.retrieve("login") != null) {
            this.isLoggedIn = true;
		}
        this.getArticleId();
        this.getArticleDetails();
    }

    getArticleId() {
        this.activatedRoute.params.subscribe((params: ParameterDecorator) => {
            this.articleId = params['id'];
        });
    }

    getArticleDetails() {
        this.databaseService.getArticleDetails(this.articleId).takeUntil(this.unsubscribe).subscribe(response => {
            if (response != 'Not found') {
                this.article = response[0];
                if(this.article.comments){
                    this.comments = this.article.comments
                    this.setPage(1);
                }
            }
        });
    }

    addArticleComment(target){
        if(this.commentTexte.nativeElement.value != ""){
            var comment = {
                'user': this.session.retrieve("login").id,
                'article': this.articleId,
                'texte': this.commentTexte.nativeElement.value
            }
            this.databaseService.addArticleComment(comment).takeUntil(this.unsubscribe).subscribe(
                response => {
                    if(response == "Inserted"){
                        this.getArticleDetails();
                        target.scrollIntoView({behavior:"smooth"});
                        this.isSuccess = true;
                        this.commentTexte.nativeElement.value = "";
                    }  
                }
            )
        }
        else{
            this.isSuccess = false;
        }
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
