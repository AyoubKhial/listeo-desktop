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
    private orderActive : boolean;
    public privileges: Object;
    public city: string;
    public open: boolean;
    public alreadyHaveLocation: boolean;
    private userLongitude: number;
    private userLatitude: number;
    private data: any;
    private unsubscribe = new Subject<void>();

    constructor(private databaseService: DatabaseService, private pagerService: PagerService) {
        this.listingList = true;
        this.listingGrid = false;
        this.orderActive = false;
        this.choosenOrder = "Newest Listings";
        this.city = "";
        this.open = false;
        this.alreadyHaveLocation = false;
    }

    ngOnInit() {
        var scriptCall = document.getElementById('scriptCall');
        scriptCall.click();
        this.getAllActivatedRestaurants();
        this.getAllPrivileges();
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
		}
		if(this.choosenOrder == 'Lowest Price'){
            this.restaurants.unshift("Lowest Price");
        }
        if(this.choosenOrder == 'Highest Rated'){
            this.restaurants.unshift("Highest Rated");
        }
        if(this.choosenOrder == 'Most Reviewed'){
            this.restaurants.unshift("Most Reviewed");
        }
        if(this.choosenOrder == 'Newest Listings'){
            this.restaurants.unshift("Newest Listings");
        }
        if(this.choosenOrder == 'Oldest Listings'){
            this.restaurants.unshift("Oldest Listings");
        }
        this.databaseService.orderRestaurants(this.restaurants).takeUntil(this.unsubscribe).subscribe(response=> {
            if (response != 'Not found') {
                this.restaurants = response;
                this.setPage(1);
            }
        })
    }

    getAllPrivileges(){
		this.databaseService.getAllPrivileges().takeUntil(this.unsubscribe).subscribe(res => {
			if (res != 'Not found') {
				this.privileges = res;
			}
		});
    }
    
    doFilter(){
		var radiusSelected = parseInt(document.getElementsByClassName('range-output')[0].innerHTML) / 1000;
		var citySelected = this.city;
		var privilegesChecked = [];
		for(var i = 0; i<document.getElementsByClassName('privilege').length; i++){
            if((document.getElementById('check-'+i) as HTMLInputElement).checked == true){
                privilegesChecked.push((document.getElementById('check-'+i) as HTMLInputElement).value);
            }
        }		
		if (navigator.geolocation && !this.alreadyHaveLocation) {
            if(radiusSelected != 0){
                navigator.geolocation.getCurrentPosition((position) => {
                    this.userLatitude = position.coords.latitude;
                    this.userLongitude = position.coords.longitude;
                    this.data = { 
                        city: citySelected,
                        open: this.open,
                        privileges: privilegesChecked,
                        radius: radiusSelected,
                        latitude: this.userLatitude,
                        longitude: this.userLongitude
                    }
                    this.databaseService.filterRestaurants(this.data).takeUntil(this.unsubscribe).subscribe(res => {
                        if (res != '0') {
                            this.choosenOrder = "Newest Listings";
                            this.restaurants = res;
                            this.setPage(1);
                        }
                        else {
                            this.pagedRestaurants = [];
                        }
                    });
                    this.alreadyHaveLocation = true;
                });
            }
            else{
                this.data = { 
                    city: citySelected,
                    open: this.open,
                    privileges: privilegesChecked,
                    radius: radiusSelected,
                    latitude: this.userLatitude,
                    longitude: this.userLongitude
                }
                this.databaseService.filterRestaurants(this.data).takeUntil(this.unsubscribe).subscribe(res => {
                    if (res != '0') {
                        this.choosenOrder = "Newest Listings";
                        this.restaurants = res;
                        this.setPage(1);
                    }
                    else {
                        this.pagedRestaurants = [];
                    }
                });
            }
		}
		if(this.alreadyHaveLocation){
			this.data.city = citySelected;
			this.data.open = this.open;
			this.data.privileges = privilegesChecked;
			this.data.radius = radiusSelected;
			this.databaseService.filterRestaurants(this.data).takeUntil(this.unsubscribe).subscribe(res => {
				if (res != '0') {
                    this.choosenOrder = "Newest Listings";
					this.restaurants = res;
					this.setPage(1);
				}
				else {
					this.pagedRestaurants = [];
				}
				
			});
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
