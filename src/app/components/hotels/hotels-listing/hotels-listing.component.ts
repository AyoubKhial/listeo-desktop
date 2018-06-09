import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { PagerService } from '../../../services/pager/pager.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-hotels-listing',
    templateUrl: './hotels-listing.component.html',
    styleUrls: ['./hotels-listing.component.css']
})
export class HotelsListingComponent implements OnInit, OnDestroy {

    public listingList: boolean;
    public listingGrid: boolean;
    public hotels: any[];
    public pager: any = {};
    public pagedHotels: any[];
    private orderActive : boolean;
    public privileges: Object;
    public choosenOrder: string;
    public city: string;
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
        this.alreadyHaveLocation = false;
    }

    ngOnInit() {
        this.getAllActivatedHotels();
        this.getAllPrivileges();
    }

    getAllActivatedHotels() {
        this.databaseService.getAllActivatedHotels().takeUntil(this.unsubscribe).subscribe(response => {
            if (response != 'Not found') {
                this.hotels = response;
                this.setPage(1);
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
    orderHotels(event:Event){
        this.choosenOrder = event.srcElement.innerHTML;
		if(this.choosenOrder == 'Highest Price'){
            this.hotels.unshift("Highest Price");
		}
		if(this.choosenOrder == 'Lowest Price'){
            this.hotels.unshift("Lowest Price");
        }
        if(this.choosenOrder == 'Highest Rated'){
            this.hotels.unshift("Highest Rated");
        }
        if(this.choosenOrder == 'Most Reviewed'){
            this.hotels.unshift("Most Reviewed");
        }
        if(this.choosenOrder == 'Newest Listings'){
            this.hotels.unshift("Newest Listings");
        }
        if(this.choosenOrder == 'Oldest Listings'){
            this.hotels.unshift("Oldest Listings");
        }
        this.databaseService.orderHotels(this.hotels).takeUntil(this.unsubscribe).subscribe(response=> {
            if (response != 'Not found') {
                this.hotels = response;
                this.setPage(1);
            }
        })
    }

    getAllPrivileges(){
		this.databaseService.getAllPrivileges().takeUntil(this.unsubscribe).subscribe(response => {
			if (response != 'Not found') {
				this.privileges = response;
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
                        privileges: privilegesChecked,
                        radius: radiusSelected,
                        latitude: this.userLatitude,
                        longitude: this.userLongitude
                    }
                    this.databaseService.filterHotels(this.data).takeUntil(this.unsubscribe).subscribe(response => {
                        if (response != '0') {
                            this.choosenOrder = "Newest Listings";
                            this.hotels = response;
                            this.setPage(1);
                        }
                        else {
                            this.pagedHotels = [];
                        }
                    });
                    this.alreadyHaveLocation = true;
                });
            }
            else{
                this.data = { 
                    city: citySelected,
                    privileges: privilegesChecked,
                    radius: radiusSelected,
                    latitude: this.userLatitude,
                    longitude: this.userLongitude
                }
                this.databaseService.filterHotels(this.data).takeUntil(this.unsubscribe).subscribe(response => {
                    if (response != '0') {
                        this.choosenOrder = "Newest Listings";
                        this.hotels = response;
                        this.setPage(1);
                    }
                    else {
                        this.pagedHotels = [];
                    }
                });
            }
		}
		if(this.alreadyHaveLocation){
			this.data.city = citySelected;
			this.data.privileges = privilegesChecked;
			this.data.radius = radiusSelected;
			this.databaseService.filterHotels(this.data).takeUntil(this.unsubscribe).subscribe(response => {
				if (response != '0') {
                    this.choosenOrder = "Newest Listings";
					this.hotels = response;
					this.setPage(1);
				}
				else {
					this.pagedHotels = [];
				}
				
			});
		}
	}

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.hotels.length, page, 6);
        this.pagedHotels = this.hotels.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    getStars(rating) {
        return { 'width': parseFloat(rating) / 5 * 100 + '%' };
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
