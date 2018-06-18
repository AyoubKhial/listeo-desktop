import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { SessionStorageService } from 'ngx-webstorage';
import { RequestOptions, Headers } from '@angular/http';

@Component({
    selector: 'app-add-restaurant',
    templateUrl: './add-restaurant.component.html',
    styleUrls: ['./add-restaurant.component.css']
})
export class AddRestaurantComponent implements OnInit, OnDestroy {

    @ViewChild('restaurantCat') restaurantCat;
    @ViewChild('restaurantCit') restaurantCit;
    @ViewChild('restaurantAddr') restaurantAddr;
    @ViewChild('restaurantLng') restaurantLng;
    @ViewChild('restaurantLat') restaurantLat;
    @ViewChild('mondayOpeningTime') mondayOpeningTime;
    @ViewChild('mondayClosingTime') mondayClosingTime;
    @ViewChild('tuesdayOpeningTime') tuesdayOpeningTime;
    @ViewChild('tuesdayClosingTime') tuesdayClosingTime;
    @ViewChild('wednesdayOpeningTime') wednesdayOpeningTime;
    @ViewChild('wednesdayClosingTime') wednesdayClosingTime;
    @ViewChild('thursdayOpeningTime') thursdayOpeningTime;
    @ViewChild('thursdayClosingTime') thursdayClosingTime;
    @ViewChild('fridayOpeningTime') fridayOpeningTime;
    @ViewChild('fridayClosingTime') fridayClosingTime;
    @ViewChild('saturdayOpeningTime') saturdayOpeningTime;
    @ViewChild('saturdayClosingTime') saturdayClosingTime;
    @ViewChild('sundayOpeningTime') sundayOpeningTime;
    @ViewChild('sundayClosingTime') sundayClosingTime;
    public categories;
    public countries;
    public privileges;
    public images = [];
    public hours = [
        '01:00:00', '02:00:00', '03:00:00', '04:00:00', '05:00:00', '06:00:00', '07:00:00', '08:00:00',
        '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00',
        '17:00:00', '18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00', '00:00:00'
    ]
    public addRestaurantForm: FormGroup;
    public restaurantName: FormControl;
    public restaurantCategory: FormControl;
    public restaurantCity: FormControl;
    public restaurantAddress: FormControl;
    public restaurantDescription: FormControl;
    public restaurantPhone: FormControl;
    public restaurantWebsite: FormControl;
    public restaurantEmail: FormControl;
    public restaurantFacebook: FormControl;
    public restaurantTwitter: FormControl;
    public restaurantInstagram: FormControl;
    public restaurantLongitude: FormControl;
    public restaurantLatitude: FormControl;
    private unsubscribe = new Subject<void>();
    private userId: number;
    public isSuccess: boolean;

    constructor(private session: SessionStorageService, private databaseService: DatabaseService) { }

    ngOnInit() {
        this.userId = this.session.retrieve("login").id;
        this.getAllCategories();
        this.getAllCountries();
        this.getAllPrivileges();
        this.createFormControls();
        this.createForm();
    }
    getAllCategories() {
        this.databaseService.getAllCategories().takeUntil(this.unsubscribe).subscribe(res => this.categories = res);
    }

    getAllCountries() {
        this.databaseService.getAllCountries().takeUntil(this.unsubscribe).subscribe(res => this.countries = res);
    }

    getAllPrivileges() {
        this.databaseService.getAllPrivileges().takeUntil(this.unsubscribe).subscribe(res => this.privileges = res);
    }

    createFormControls() {
        this.restaurantName = new FormControl('', [
            Validators.required,
            Validators.maxLength(200)
        ]);
        this.restaurantCategory = new FormControl('', [
            Validators.required
        ]);
        this.restaurantCity = new FormControl('', [
            Validators.required
        ]);
        this.restaurantAddress = new FormControl('', [
            Validators.required
        ]);
        this.restaurantAddress.setValue(this.restaurantAddr.nativeElement.value)
        this.restaurantDescription = new FormControl();
        this.restaurantPhone = new FormControl('', [
            Validators.pattern("[0][6-7-5][0-9]{8}")
        ]);
        this.restaurantWebsite = new FormControl('', [
            Validators.pattern("^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})$")
        ]);
        this.restaurantEmail = new FormControl('', [
            Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*\\.[a-zA-Z]{2,4}$')
        ]);
        this.restaurantFacebook = new FormControl();
        this.restaurantTwitter = new FormControl();
        this.restaurantInstagram = new FormControl();
        this.restaurantLongitude = new FormControl('', [
            Validators.required
        ]);
        this.restaurantLatitude = new FormControl('', [
            Validators.required
        ])
    }

    createForm() {
        this.addRestaurantForm = new FormGroup({
            restaurantName: this.restaurantName,
            restaurantCategory: this.restaurantCategory,
            restaurantCity: this.restaurantCity,
            restaurantAddress: this.restaurantAddress,
            restaurantDescription: this.restaurantDescription,
            restaurantPhone: this.restaurantPhone,
            restaurantWebsite: this.restaurantWebsite,
            restaurantEmail: this.restaurantEmail,
            restaurantFacebook: this.restaurantFacebook,
            restaurantTwitter: this.restaurantTwitter,
            restaurantInstagram: this.restaurantInstagram,
            restaurantLongitude: this.restaurantLongitude,
            restaurantLatitude: this.restaurantLatitude
        });
    }

    addRestaurant(target) {
        var mondayOpening = this.mondayOpeningTime.nativeElement.value;
        var mondayClosing = this.mondayClosingTime.nativeElement.value;
        var tuesdayOpening = this.tuesdayOpeningTime.nativeElement.value;
        var tuesdayClosing = this.tuesdayClosingTime.nativeElement.value;
        var wednesdayOpening = this.wednesdayOpeningTime.nativeElement.value;
        var wednesdayClosing = this.wednesdayClosingTime.nativeElement.value;
        var thursdayOpening = this.thursdayOpeningTime.nativeElement.value;
        var thursdayClosing = this.thursdayClosingTime.nativeElement.value;
        var fridayOpening = this.fridayOpeningTime.nativeElement.value;
        var fridayClosing = this.fridayClosingTime.nativeElement.value;
        var saturdayOpening = this.saturdayOpeningTime.nativeElement.value;
        var saturdayClosing = this.saturdayClosingTime.nativeElement.value;
        var sundayOpening = this.sundayOpeningTime.nativeElement.value;
        var sundayClosing = this.sundayClosingTime.nativeElement.value;

        var optionsChecked = [];
        this.restaurantCategory.setValue(this.restaurantCat.nativeElement.value);
        this.restaurantCity.setValue(this.restaurantCit.nativeElement.value);
        this.restaurantAddress.setValue(this.restaurantAddr.nativeElement.value);
        this.restaurantLongitude.setValue(this.restaurantLng.nativeElement.value);
        this.restaurantLatitude.setValue(this.restaurantLat.nativeElement.value);
        for (var i = 0; i < document.getElementsByClassName('privilege').length; i++) {
            if ((document.getElementById('check-' + i) as HTMLInputElement).checked == true) {
                optionsChecked.push((document.getElementById('check-' + i) as HTMLInputElement).value);
            }
        }

        if (this.addRestaurantForm.valid) {
            var name = this.addRestaurantForm.value.restaurantName;
            var address = this.addRestaurantForm.value.restaurantAddress;
            var description = this.addRestaurantForm.value.restaurantDescription;
            var phone = this.addRestaurantForm.value.restaurantPhone;
            var email = this.addRestaurantForm.value.restaurantEmail;
            var website = this.addRestaurantForm.value.restaurantWebsite;
            var facebook = this.addRestaurantForm.value.restaurantFacebook;
            var twitter = this.addRestaurantForm.value.restaurantTwitter;
            var instagram = this.addRestaurantForm.value.restaurantInstagram;
            var latitude = this.addRestaurantForm.value.restaurantLatitude;
            var longitude = this.addRestaurantForm.value.restaurantLongitude;
            var category = this.addRestaurantForm.value.restaurantCategory;
            var city = this.addRestaurantForm.value.restaurantCity;
            var nbrCategories = document.getElementsByClassName("titleC").length;
            var nbrItems;
            var categoryName;
            var itemName;
            var itemPrice;
            var categoriesWithPlats = []
            for (var i = 0; i < nbrCategories; i++) {
                var c = i + 1;
                categoryName = (document.getElementsByClassName("titleC")[i] as HTMLInputElement).value;
                nbrItems = document.getElementsByClassName('cat' + c + '').length;
                var platArray = [];
                for (var j = 0; j < nbrItems; j++) {
                    var platObject = {}
                    itemName = (document.getElementsByClassName('cat' + c + '')[j] as HTMLInputElement).value;
                    itemPrice = (document.getElementsByClassName('pr' + c + '')[j] as HTMLInputElement).value;
                    platObject["plat"] = itemName;
                    platObject["price"] = itemPrice;
                    platArray.push(platObject);
                    var jr = { 'Category ': categoryName, platArray };
                }
                categoriesWithPlats.push(jr);
            }
            var horaire = {
                'monday': {
                    'opening': mondayOpening,
                    'closing': mondayClosing
                },
                'tuesday': {
                    'opening': tuesdayOpening,
                    'closing': tuesdayClosing
                },
                'wednesday': {
                    'opening': wednesdayOpening,
                    'closing': wednesdayClosing
                },
                'thursday': {
                    'opening': thursdayOpening,
                    'closing': thursdayClosing
                },
                'friday': {
                    'opening': fridayOpening,
                    'closing': fridayClosing
                },
                'saturday': {
                    'opening': saturdayOpening,
                    'closing': saturdayClosing
                },
                'sunday': {
                    'opening': sundayOpening,
                    'closing': sundayClosing
                },
            }
            var restaurant = {
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
                'category': category,
                'city': city,
                'images': this.images,
                'privilege': optionsChecked,
                'user': this.userId
            }
            var formData = new FormData();
            for (var key in restaurant) {
                if (key == "images") {
                    for (var e = 0; e < this.images.length; e++) {
                        formData.append("fileToUpload[]", this.images[e]);
                    }
                }
                formData.append(key, restaurant[key]);
            }
            formData.append("horaire", JSON.stringify(horaire));
            formData.append("pricing", JSON.stringify(categoriesWithPlats));
            const headers = new Headers();
            headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            this.databaseService.addRestaurant(formData, options).takeUntil(this.unsubscribe).subscribe(response => {
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
