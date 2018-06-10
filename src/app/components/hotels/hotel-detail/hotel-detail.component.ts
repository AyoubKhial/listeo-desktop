import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { DatabaseService } from '../../../services/database/database.service';
import { PagerService } from '../../../services/pager/pager.service';
import 'rxjs/add/operator/takeUntil';

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
    
    constructor(private activatedRoute: ActivatedRoute, private databaseService: DatabaseService, private pagerService: PagerService) {
    }

    ngOnInit() {
        this.getHotelId();
        this.getHotelDetails();
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
                if(this.hotel.comments){
                    this.comments = this.hotel.comments
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
