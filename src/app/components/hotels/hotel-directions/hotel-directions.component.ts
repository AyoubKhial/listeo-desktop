import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject} from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { DatabaseService } from '../../../services/database/database.service';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-hotel-directions',
    templateUrl: './hotel-directions.component.html',
    styleUrls: ['./hotel-directions.component.css']
})
export class HotelDirectionsComponent implements OnInit {

    private hotelId: number;
    public hotel;
    private unsubscribe = new Subject<void>();

    constructor(private activatedRoute: ActivatedRoute, private databaseService: DatabaseService) {
    }

    ngOnInit() {
        var x = document.getElementById("listing-nav");
        if(x != null){
            x.remove();
        }
        this.getHotelId();
        this.getHotelBasicInformation();
    }


    getHotelId() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.hotelId = params['id'];
        });
    }

    getHotelBasicInformation() {
        this.databaseService.getHotelBasicInformation(this.hotelId).takeUntil(this.unsubscribe).subscribe(response => {
            if (response != 'Not found') {
                this.hotel = response[0];
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
