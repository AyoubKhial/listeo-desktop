import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {

    public subscribeForm: FormGroup;
    public email: FormControl;
    public queryResult: string;
    private unsubscribe = new Subject<void>();

    constructor(private databaseService: DatabaseService) { }

    ngOnInit() {
        this.createFormControls();
        this.createForm();
    }

    createFormControls() {
        this.email = new FormControl('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*\\.[a-zA-Z]{2,4}$')
        ]);
    }

    createForm() {
        this.subscribeForm = new FormGroup({
            email: this.email
        });
    }

    addSubscriber() {
        if (this.subscribeForm.valid) {
            this.databaseService.addSubscriber(this.subscribeForm.value)
                .takeUntil(this.unsubscribe)
                .subscribe(res => this.queryResult = res);
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
