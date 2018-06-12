import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DatabaseService } from '../../../services/database/database.service';
import { PagerService } from '../../../services/pager/pager.service';
import 'rxjs/add/operator/takeUntil';
import { FormGroup, FormControl } from '@angular/forms';
import { SessionStorageService } from 'ngx-webstorage';
import { RequestOptions, Headers } from '@angular/http';

@Component({
    selector: 'app-restaurant-detail',
    templateUrl: './restaurant-detail.component.html',
    styleUrls: ['./restaurant-detail.component.css'],

})
export class RestaurantDetailComponent implements OnInit, OnDestroy {

    private restaurantId: number;
    public restaurant;
    private unsubscribe = new Subject<void>();
    private comments: any[];
    public pager: any = {};
    public pagedComments: any[];
    public addRestaurantComentForm: FormGroup;
    public commentRating: FormControl;
    public commentReview: FormControl;
    public commentPhotos= [];
    public isLoggedIn: boolean;

    constructor(private activatedRoute: ActivatedRoute,
        private databaseService: DatabaseService,
        private pagerService: PagerService,
        private session: SessionStorageService) {
        this.isLoggedIn = false;
    }

    ngOnInit() {
        if (this.session.retrieve("login") != null) {
			this.isLoggedIn = true;
		}
        this.getRestaurantId();
        this.getRestaurantDetails();
        this.createCommentControls();
        this.createCommentForm();
    }

    getRestaurantId() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.restaurantId = params['id'];
        });
    }

    getRestaurantDetails() {
        this.databaseService.getRestaurantDetails(this.restaurantId).takeUntil(this.unsubscribe).subscribe(response => {
            if (response != 'Not found') {
                this.restaurant = response[0];
                if (this.restaurant.comments) {
                    this.comments = this.restaurant.comments
                    this.setPage(1);
                }
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

    createCommentForm() {
        this.addRestaurantComentForm = new FormGroup(
            {
                commentRating: this.commentRating,
                commentReview: this.commentReview,
            }
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

    addRestaurantComent() {
        var user = this.session.retrieve("login").id;
        var restaurant = this.restaurantId;
        var review = this.addRestaurantComentForm.value.commentReview;
        var rating = this.addRestaurantComentForm.value.commentRating;
		var formValues = {
            'user': user,
            'restaurant': restaurant,
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
		this.databaseService.addRestaurantComment(formData, options).takeUntil(this.unsubscribe).subscribe(res => console.log(res));
		this.addRestaurantComentForm.reset();
		this.commentPhotos = [];
    }

    getStars(rating) {
        return { 'width': parseFloat(rating) / 5 * 100 + '%' };
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
