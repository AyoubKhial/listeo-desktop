import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DatabaseService } from '../../../services/database/database.service';
import { PagerService } from '../../../services/pager/pager.service';
import 'rxjs/add/operator/takeUntil';
import { FormGroup, FormControl } from '@angular/forms';
import { SessionStorageService } from 'ngx-webstorage';
import { RequestOptions, Headers } from '@angular/http';



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

    constructor(private activatedRoute: ActivatedRoute,
        private databaseService: DatabaseService,
        private pagerService: PagerService,
        private session: SessionStorageService) {
        this.isLoggedIn = false;
        this.isSuccess = true;
    }

    ngOnInit() {
        if (this.session.retrieve("login") != null) {
            this.isLoggedIn = true;
        }
        this.getHotelId();
        this.getHotelDetails();
        this.createCommentControls();
        this.createCommentForm();
    }

    getHotelId() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.hotelId = params['id'];
        });
    }

    getHotelDetails() {
        this.databaseService.getHotelDetails(this.hotelId).takeUntil(this.unsubscribe).subscribe(response => {
            if (response != 'Not found') {
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

    addHotelComent() {
        if (this.addHotelCommentForm.valid) {
            var user = this.session.retrieve("login").id;
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
