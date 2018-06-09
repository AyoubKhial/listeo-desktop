import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject} from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { DatabaseService } from '../../../services/database/database.service';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'app-restaurant-directions',
    templateUrl: './restaurant-directions.component.html',
    styleUrls: ['./restaurant-directions.component.css']
})
export class RestaurantDirectionsComponent implements OnInit, OnDestroy {

    private restaurantId: number;
    public restaurant;
    private unsubscribe = new Subject<void>();

    constructor(private activatedRoute: ActivatedRoute, private databaseService: DatabaseService) {
    }

    ngOnInit() {
        var x = document.getElementById("listing-nav");
        if(x != null){
            x.remove();
        }
        this.getRestaurantId();
        this.getRestaurantBasicInformation();
    }


    getRestaurantId() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.restaurantId = params['id'];
        });
    }

    getRestaurantBasicInformation() {
        this.databaseService.getRestaurantBasicInformation(this.restaurantId).takeUntil(this.unsubscribe).subscribe(response => {
            if (response != 'Not found') {
                this.restaurant = response[0];
            }
        });
    }

    getStars(rating) {
        return { 'width': parseFloat(rating) / 5 * 100 + '%' };
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
