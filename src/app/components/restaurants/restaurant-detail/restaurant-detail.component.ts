import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DatabaseService } from '../../../services/database/database.service';
import { PagerService } from '../../../services/pager/pager.service';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'app-restaurant-detail',
    templateUrl: './restaurant-detail.component.html',
    styleUrls: ['./restaurant-detail.component.css'],

})
export class RestaurantDetailComponent implements OnInit, OnDestroy {

    private restaurantId: number;
    public restaurant;
    private unsubscribe = new Subject<void>();
    public comments: any[];
    public pager: any = {};
    public pagedComments: any[];
    
    constructor(private activatedRoute: ActivatedRoute, private databaseService: DatabaseService, private pagerService: PagerService) {
    }

    ngOnInit() {
        this.getRestaurantId();
        this.getRestaurantDetails();
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
                if(this.restaurant.comments){
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

    getStars(rating) {
        return { 'width': parseFloat(rating) / 5 * 100 + '%' };
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
