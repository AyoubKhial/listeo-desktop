import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { PagerService } from '../../../services/pager/pager.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-articles-listing',
    templateUrl: './articles-listing.component.html',
    styleUrls: ['./articles-listing.component.css']
})
export class ArticlesListingComponent implements OnInit, OnDestroy {

    public articles: any[];
    public popularArticles: Object;
    public articleSearchForm: FormGroup;
    public term: FormControl;
    private inSearch: boolean;
    public requiredField: boolean;
    public pager: any = {};
    public pagedArticles: any[];
    private unsubscribe = new Subject<void>();

    constructor(private databaseService: DatabaseService, private pagerService: PagerService) {
        this.inSearch = false;
        this.requiredField = false;
    }

    ngOnInit() {
        if (!this.inSearch) {
            this.createFormControls();
            this.createForm();
            this.getAllActivatedArticles();
            this.getMostPopularArticles();
        }
        else {
            this.getArticlesByTitle(this.articleSearchForm.value);
        }
    }

    getAllActivatedArticles() {
        this.databaseService.getAllActivatedArticles().takeUntil(this.unsubscribe).subscribe(response => {
            if (response != 'Not found') {
                for(var i = 0 ; i< response.length ; i++){
                    response[i].texte = response[i].texte.replace(/(<([^>]+)>)/ig,"")
                }
                this.articles = response;
                this.setPage(1);
            }
        });
    }

    getMostPopularArticles() {
        this.databaseService.getMostPopularArticles().takeUntil(this.unsubscribe).subscribe(response => {
            if (response != 'Not found') {
                this.popularArticles = response;
            }
        });
    }

    createFormControls() {
        this.term = new FormControl('', [
            Validators.required,
        ]);
    }

    createForm() {
        this.articleSearchForm = new FormGroup({
            term: this.term
        });
    }

    searchForArticle() {
        if (this.articleSearchForm.valid) {
            if (!this.inSearch) {
                this.inSearch = true;
                this.requiredField = false;
            }
            this.ngOnInit();
        }
        else {
            this.requiredField = true;
        }
    }

    getArticlesByTitle(term) {
        this.databaseService.getArticlesByTitle(term).takeUntil(this.unsubscribe).subscribe(res => {
            if (res != 'Not found') {
                this.articles = res;
                this.setPage(1);
            }
            else {
                this.pagedArticles = [];
            }
        });
    }

    setPage(page: number, target?) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.articles.length, page, 3);
        this.pagedArticles = this.articles.slice(this.pager.startIndex, this.pager.endIndex + 1);
        if(target)
        target.scrollIntoView({ behavior: "smooth" });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
