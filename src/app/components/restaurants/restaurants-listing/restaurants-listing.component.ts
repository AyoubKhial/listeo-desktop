import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { PagerService } from '../../../services/pager/pager.service';

@Component({
    selector: 'app-restaurants-listing',
    templateUrl: './restaurants-listing.component.html',
    styleUrls: ['./restaurants-listing.component.css']
})
export class RestaurantsListingComponent implements OnInit, OnDestroy {

    public restaurants: any[];
    public pager: any = {};
    public pagedRestaurants: any[];
    public listingList: boolean;
    public listingGrid: boolean;
    public choosenOrder: string;
    public orderActive : boolean;
    private unsubscribe = new Subject<void>();

    constructor(private databaseService: DatabaseService, private pagerService: PagerService) {
        this.listingList = true;
        this.listingGrid = false;
        this.orderActive = false;
        this.choosenOrder = "Default Order";
    }

    ngOnInit() {
        var scriptCall = document.getElementById('scriptCall');
        scriptCall.click();
        this.getAllActivatedRestaurants();
    }

    getAllActivatedRestaurants() {
        this.databaseService.getAllActivatedRestaurants().takeUntil(this.unsubscribe).subscribe(res => {
            if (res != 'Not found') {
                this.restaurants = res;
                this.setPage(1);
            }
            else {
                console.log("No restaurants FOUND");
            }
        });
    }

    doOrder(){
        if(!this.orderActive){
            document.getElementById("choosenOrder").classList.add("chosen-container-active");
            this.orderActive = true;
        }
        else{
            document.getElementById("choosenOrder").classList.remove("chosen-container-active");
            this.orderActive = false;
        }
    }

    orderRestaurants(event:Event){
        this.choosenOrder = event.srcElement.innerHTML;
		if(this.choosenOrder == 'Highest Price'){
            this.restaurants.unshift("Highest Price");
			this.databaseService.orderRestaurants(this.restaurants).takeUntil(this.unsubscribe).subscribe(response=> {
				if (response != 'Not found') {
					this.restaurants = response;
					this.setPage(1);
				}
            })
		}
		if(this.choosenOrder == 'Lowest Price'){
            this.restaurants.unshift("Lowest Price");
			this.databaseService.orderRestaurants(this.restaurants).takeUntil(this.unsubscribe).subscribe(response=> {
				if (response != 'Not found') {
					this.restaurants = response;
					this.setPage(1);
				}
            })
		}
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.restaurants.length, page, 6);
        this.pagedRestaurants = this.restaurants.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    getStars(rating) {
        return { 'width': parseFloat(rating) / 5 * 100 + '%' };
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
