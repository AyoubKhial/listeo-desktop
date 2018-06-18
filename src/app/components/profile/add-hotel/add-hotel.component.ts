import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { SessionStorageService } from 'ngx-webstorage';
import { RequestOptions, Headers } from '@angular/http';

@Component({
    selector: 'app-add-hotel',
    templateUrl: './add-hotel.component.html',
    styleUrls: ['./add-hotel.component.css']
})
export class AddHotelComponent implements OnInit, OnDestroy {

    @ViewChild('hotelCat') hotelCat;
    @ViewChild('hotelCit') hotelCit;
    @ViewChild('hotelAddr') hotelAddr;
    @ViewChild('hotelLng') hotelLng;
    @ViewChild('hotelLat') hotelLat;
    public countries;
    public privileges;
    public images = [];
    public addHotelForm: FormGroup;
    public hotelName: FormControl;
    public hotelCity: FormControl;
    public hotelAddress: FormControl;
    public hotelDescription: FormControl;
    public hotelPhone: FormControl;
    public hotelWebsite: FormControl;
    public hotelEmail: FormControl;
    public hotelFacebook: FormControl;
    public hotelTwitter: FormControl;
    public hotelInstagram: FormControl;
    public hotelLongitude: FormControl;
    public hotelLatitude: FormControl;
    private unsubscribe = new Subject<void>();
    private userId: number;
    public isSuccess: boolean;

    constructor(private session: SessionStorageService, private databaseService: DatabaseService) { 

    }

    ngOnInit() {
        this.userId = this.session.retrieve("login").id;
        this.getAllCountries();
        this.getAllPrivileges();
        this.createFormControls();
        this.createForm();
    }

    getAllCountries() {
        this.databaseService.getAllCountries().takeUntil(this.unsubscribe).subscribe(res => this.countries = res);
    }

    getAllPrivileges() {
        this.databaseService.getAllPrivileges().takeUntil(this.unsubscribe).subscribe(res => this.privileges = res);
    }

    createFormControls() {
        this.hotelName = new FormControl('', [
            Validators.required,
            Validators.maxLength(200)
        ]);
        this.hotelCity = new FormControl('', [
            Validators.required
        ]);
        this.hotelAddress = new FormControl('', [
            Validators.required
        ]);
        this.hotelAddress.setValue(this.hotelAddr.nativeElement.value)
        this.hotelDescription = new FormControl();
        this.hotelPhone = new FormControl('', [
            Validators.pattern("[0][6-7-5][0-9]{8}")
        ]);
        this.hotelWebsite = new FormControl('', [
            Validators.pattern("^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})$")
        ]);
        this.hotelEmail = new FormControl('', [
            Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*\\.[a-zA-Z]{2,4}$')
        ]);
        this.hotelFacebook = new FormControl();
        this.hotelTwitter = new FormControl();
        this.hotelInstagram = new FormControl();
        this.hotelLongitude = new FormControl('', [
            Validators.required
        ]);
        this.hotelLatitude = new FormControl('', [
            Validators.required
        ])
    }

    createForm() {
        this.addHotelForm = new FormGroup({
            hotelName: this.hotelName,
            hotelCity: this.hotelCity,
            hotelAddress: this.hotelAddress,
            hotelDescription: this.hotelDescription,
            hotelPhone: this.hotelPhone,
            hotelWebsite: this.hotelWebsite,
            hotelEmail: this.hotelEmail,
            hotelFacebook: this.hotelFacebook,
            hotelTwitter: this.hotelTwitter,
            hotelInstagram: this.hotelInstagram,
            hotelLongitude: this.hotelLongitude,
            hotelLatitude: this.hotelLatitude
        });
    }

    addHotel(target) {
        var optionsChecked = [];
        this.hotelCity.setValue(this.hotelCit.nativeElement.value);
        this.hotelAddress.setValue(this.hotelAddr.nativeElement.value);
        this.hotelLongitude.setValue(this.hotelLng.nativeElement.value);
        this.hotelLatitude.setValue(this.hotelLat.nativeElement.value);
        for (var i = 0; i < document.getElementsByClassName('privilege').length; i++) {
            if ((document.getElementById('check-' + i) as HTMLInputElement).checked == true) {
                optionsChecked.push((document.getElementById('check-' + i) as HTMLInputElement).value);
            }
        }

        if (this.addHotelForm.valid) {
            var name = this.addHotelForm.value.hotelName;
            var address = this.addHotelForm.value.hotelAddress;
            var description = this.addHotelForm.value.hotelDescription;
            var phone = this.addHotelForm.value.hotelPhone;
            var email = this.addHotelForm.value.hotelEmail;
            var website = this.addHotelForm.value.hotelWebsite;
            var facebook = this.addHotelForm.value.hotelFacebook;
            var twitter = this.addHotelForm.value.hotelTwitter;
            var instagram = this.addHotelForm.value.hotelInstagram;
            var latitude = this.addHotelForm.value.hotelLatitude;
            var longitude = this.addHotelForm.value.hotelLongitude;
            var city = this.addHotelForm.value.hotelCity;

            var nbrChambreTypes = document.getElementsByClassName("titleI").length;
			var categoryName;
			var itemPrice;
			var chambresWithType = []
			for (var i = 0; i < nbrChambreTypes; i++) {
				categoryName = (document.getElementsByClassName("titleI")[i] as HTMLInputElement).value;
				itemPrice = (document.getElementsByClassName("priceI")[i] as HTMLInputElement).value;
				var jr = { 'chambre ': categoryName, itemPrice };
				chambresWithType.push(jr);
			}
            var hotel = {
                'name': name,
                'address': address,
                'description': description,
                'phone': phone,
                'email': email,
                'website': website,
                'facebook': facebook,
                'twitter': twitter,
                'instagram': instagram,
                'latitude': latitude,
                'longitude': longitude,
                'city': city,
                'images': this.images,
                'privilege': optionsChecked,
                'user': this.userId
            }
            var formData = new FormData();
            for (var key in hotel) {
                if (key == "images") {
                    for (var e = 0; e < this.images.length; e++) {
                        formData.append("fileToUpload[]", this.images[e]);
                    }
                }
                formData.append(key, hotel[key]);
            }
            formData.append("pricing", JSON.stringify(chambresWithType));
            const headers = new Headers();
            headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            this.databaseService.addHotel(formData, options).takeUntil(this.unsubscribe).subscribe(response => {
                console.log(response)
                if (response == "Inserted") {
                    this.isSuccess = true;
                    target.scrollIntoView({ behavior: "smooth" });
                }
                else {
                    this.isSuccess = false;
                }
            });
        }
    }
    
    uploadImages(event) {
        for (var i = 0; i < event.target.files.length; i++) {
            this.images.push(event.target.files[i]);
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
