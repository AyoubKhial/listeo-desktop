import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PagerService } from '../../../services/pager/pager.service';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

    private userId: number;
    public messages;
    public noMessages: boolean;

    constructor(private databaseService: DatabaseService,
        private session: SessionStorageService,
        private pager: PagerService) {
        this.noMessages = false;
    }

    ngOnInit() {
        if (this.session.retrieve("login")) {
            this.userId = this.session.retrieve("login").id;
        }
        this.getMessages();
    }

    getMessages() {
        this.databaseService.getMessages(this.userId).subscribe(response => {
            if (response != "Not found") {
                this.messages = response;
            }
            else {
                this.noMessages = true;
            }
        })
    }
}
