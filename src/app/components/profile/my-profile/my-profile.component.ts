import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DatabaseService } from '../../../services/database/database.service';
import 'rxjs/add/operator/takeUntil';
import { FormGroup, FormControl } from '@angular/forms';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit, OnDestroy {

    private unsubscribe = new Subject<void>();
    private userId: number;
    public user;
    @ViewChild("firstName") first_name;
    @ViewChild("lastName") last_name;
    @ViewChild("phone") phone;
    @ViewChild("email") email;
    @ViewChild("activities") activities;
    @ViewChild("instagram") instagram;
    @ViewChild("facebook") facebook;
    public isSuccess;
    
    constructor(private databaseService: DatabaseService, private session: SessionStorageService) {
        this.isSuccess = false;
     }

    ngOnInit() {
        this.userId = this.session.retrieve("login").id;
        this.getUserInformation();
    }

    getUserInformation(){
        this.databaseService.getUserInformation(this.userId).takeUntil(this.unsubscribe).subscribe(response =>
            this.user = response[0]
        )
    }

    changeInformation(target){
        var user_information = {
            'first_name' : this.first_name.nativeElement.value,
            'last_name' : this.last_name.nativeElement.value,
            'phone' : this.phone.nativeElement.value,
            'email' : this.email.nativeElement.value,
            'activities' : this.activities.nativeElement.value,
            'instagram' : this.instagram.nativeElement.value,
            'facebook' : this.facebook.nativeElement.value,
            'user' : this.userId
        }
        this.databaseService.changeUserInformation(user_information).takeUntil(this.unsubscribe)
        .subscribe(response => {
            if(response == "Inserted"){
                this.isSuccess = true;
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
