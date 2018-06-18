import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PagerService } from '../../../services/pager/pager.service';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

    private userId: number;
    public messages: any[];
    public pager: any = {};
    public pagedMessages: any[];
    public notFound: boolean;
    private unsubscribe = new Subject<void>();

    constructor(private databaseService: DatabaseService,
        private session: SessionStorageService,
        private pagerService: PagerService) {
        this.notFound = false;
    }

    ngOnInit() {
        this.userId = this.session.retrieve("login").id;
        this.getMessages();
    }

    getMessages() {
        this.databaseService.getMessages(this.userId).takeUntil(this.unsubscribe).subscribe(response => {
            if (response != "Not found") {
                this.messages = response;
                console.log(this.messages)
                this.setPage(1);
            }
            else {
                this.notFound = true;
            }
        })
    }

    setPage(page: number, target?) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.messages.length, page, 6);
        this.pagedMessages = this.messages.slice(this.pager.startIndex, this.pager.endIndex + 1);
        if(target)
        target.scrollIntoView({ behavior: "smooth" });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
