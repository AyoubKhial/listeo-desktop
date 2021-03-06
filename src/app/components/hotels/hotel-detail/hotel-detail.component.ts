import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DatabaseService } from '../../../services/database/database.service';
import { PagerService } from '../../../services/pager/pager.service';
import 'rxjs/add/operator/takeUntil';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SessionStorageService } from 'ngx-webstorage';
import { RequestOptions, Headers } from '@angular/http';
import { ShareButtons } from '@ngx-share/core';

export function AtLeastOneFieldValidator(group: FormGroup): { [key: string]: any } {
    let isAtLeastOne = false;
    if (group && group.controls) {
        for (const control in group.controls) {
            if (group.controls.hasOwnProperty(control) && group.controls[control].valid && group.controls[control].value) {
                isAtLeastOne = true;
                break;
            }
        }
    }
    return isAtLeastOne ? null : { 'required': true };
}

@Component({
    selector: 'app-hotel-detail',
    templateUrl: './hotel-detail.component.html',
    styleUrls: ['./hotel-detail.component.css']
})

export class HotelDetailComponent implements OnInit {

    private hotelId: number;
    public hotel;
    private unsubscribe = new Subject<void>();
    private comments: any[];
    public pager: any = {};
    public pagedComments: any[];
    public commentPhotos = [];
    public addHotelCommentForm: FormGroup;
    public commentRating: FormControl;
    public commentReview: FormControl;
    public isLoggedIn: boolean;
    public isSuccess: boolean;
    public userId: number;
    public messageForm: FormGroup;
    public messageTitle: FormControl;
    public messageText: FormControl;
    public successMessageSent: boolean;

    constructor(private activatedRoute: ActivatedRoute,
        private databaseService: DatabaseService,
        private pagerService: PagerService,
        private session: SessionStorageService,
        public share: ShareButtons) {
        this.isLoggedIn = false;
        this.isSuccess = true;
        this.userId = 0;
        this.successMessageSent = false;
    }

    ngOnInit() {
        if (this.session.retrieve("login") != null) {
            this.isLoggedIn = true;
            this.userId = this.session.retrieve("login").id;
        }
        this.getHotelId();
        this.getHotelDetails();
        this.createCommentControls();
        this.createCommentForm();
        this.createMessageControls();
        this.createMessageForm();
    }

    getHotelId() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.hotelId = params['id'];
        });
    }

    getHotelDetails() {
        var data = {
            'hotel': this.hotelId,
            'user': null
        }
        if(this.isLoggedIn){
            data.user = this.userId;
        }
        this.databaseService.getHotelDetails(data).takeUntil(this.unsubscribe).subscribe(response => {
            if (response != 'Not found') {
                console.log(response)
                this.hotel = response[0];
                if (this.hotel.comments) {
                    this.comments = this.hotel.comments
                    this.setPage(1);
                }
            }
        });
    }

    createCommentForm() {
        this.addHotelCommentForm = new FormGroup(
            {
                commentRating: this.commentRating,
                commentReview: this.commentReview
            },
            AtLeastOneFieldValidator
        )
    }

    createCommentControls() {
        this.commentRating = new FormControl();
        this.commentReview = new FormControl();
    }

    getCommentPhotos(event) {
        for (var i = 0; i < event.target.files.length; i++) {
            this.commentPhotos.push(event.target.files[i]);
        }
    }

    addHotelComent(target) {
        if (this.addHotelCommentForm.valid) {
            var user = this.userId;
            var hotel = this.hotelId;
            var review = this.addHotelCommentForm.value.commentReview;
            var rating = this.addHotelCommentForm.value.commentRating;
            var formValues = {
                'user': user,
                'hotel': hotel,
                'review': review,
                'rating': rating,
                'image': this.commentPhotos
            };

            var formData = new FormData();
            for (var key in formValues) {
                if (key == "image") {
                    for (var e = 0; e < this.commentPhotos.length; e++) {
                        formData.append("fileToUpload[]", this.commentPhotos[e]);
                    }
                }
                formData.append(key, formValues[key]);
            }

            const headers = new Headers();
            headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            this.databaseService.addHotelComment(formData, options).takeUntil(this.unsubscribe).subscribe(
                response => {
                if (response == "Inserted") {
                    this.getHotelDetails();
                    this.addHotelCommentForm.reset();
                    target.scrollIntoView({behavior:"smooth"});
                    this.isSuccess = true;
                }
                else {
                    this.isSuccess = false;
                }
            });
            this.addHotelCommentForm.reset();
            this.commentPhotos = [];
        }
        else{
            this.isSuccess = false;
        }
    }

    addOrRemoveFromFavoris(event) {
        if (this.userId != 0) {
            var data = {
                item: this.hotelId,
                user: this.userId,
                action: null
            }
            if (event.target.classList.length == 2) {
                data.action = "remove";
                this.databaseService.addToFavoris(data).takeUntil(this.unsubscribe).subscribe();
            }
            else {
                data.action = "add";
                this.databaseService.addToFavoris(data).takeUntil(this.unsubscribe).subscribe();
            }
        }
    }

    createMessageForm() {
        this.messageForm = new FormGroup(
            {
                messageTitle: this.messageTitle,
                messageText: this.messageText
            }
        )
    }

    createMessageControls() {
        this.messageTitle = new FormControl('', [
            Validators.required
        ]);
        this.messageText = new FormControl('', [
            Validators.required
        ]);
    }

    sendMessageToHost(receiverId) {
        if(this.messageForm.valid){
            var data = {
                sender: this.userId,
                receiver: receiverId,
                message: this.messageForm.value.messageText,
                title: this.messageForm.value.messageTitle
            }
            this.databaseService.sendMessageToHost(data).takeUntil(this.unsubscribe).subscribe(response => {
                if(response != "Inserted"){
                    this.successMessageSent = false;
                }
                else{
                    this.successMessageSent = true;
                }
            });
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
