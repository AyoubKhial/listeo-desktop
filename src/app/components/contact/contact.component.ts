import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

    public site: any;
    public contactUsForm: FormGroup;
    public contactUsName: FormControl;
    public contactUsEmail: FormControl;
    public contactUsSubject: FormControl;
    public contactUsMessage: FormControl;
    public isSuccess: boolean;

    constructor(private databaseService: DatabaseService) { 
        this.isSuccess = false;
    }

    ngOnInit() {
        this.getSiteInformation();
        this.createContactUsControls();
        this.createContactUsForm();
    }

    getSiteInformation(){
        this.databaseService.getSiteInformation().subscribe(response => {
            if(response != "Not found"){
                response.adresse = response.adresse.split(",");
                this.site = response;
            }
        })
    }

    createContactUsForm() {
        this.contactUsForm = new FormGroup({
            contactUsName: this.contactUsName,
            contactUsEmail: this.contactUsEmail,
            contactUsSubject: this.contactUsSubject,
            contactUsMessage: this.contactUsMessage
        })
    }

    createContactUsControls() {
        this.contactUsName = new FormControl('', [
            Validators.required
        ]);
        this.contactUsEmail = new FormControl('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*\\.[a-zA-Z]{2,4}$')
        ]);
        this.contactUsSubject = new FormControl('', [
            Validators.required

        ]);
        this.contactUsMessage = new FormControl('', [
            Validators.required

        ]);
    }

    contactUs(){
        if(this.contactUsForm.valid){
            this.databaseService.contactUs(this.contactUsForm.value).subscribe(response => {
                if(response != "Error"){
                    console.log(response);
                    this.isSuccess = true;
                }
                else{
                    this.isSuccess = false;
                }
            })
        }
    }
}
