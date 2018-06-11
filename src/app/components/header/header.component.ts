import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import { DatabaseService } from '../../services/database/database.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

    public loginForm: FormGroup;
    public loginEmail: FormControl;
    public loginPassword: FormControl;
    public registerForm: FormGroup;
    public registerFirstName: FormControl;
    public registerLastName: FormControl;
    public registerEmail: FormControl;
    public registerPassword: FormControl;
    public registerRepeatPassword: FormControl;
    public registerVille: FormControl;
    @ViewChild('registerVille') registerCity;
    public loggedIn: boolean;
    public isSuccess: string;
    public loginUnsuccess: boolean;
    public countries: Object;
    public passwordMismatch: boolean;
    public isLoggedIn: boolean;
    public userInformation;
    private unsubscribe = new Subject<void>();
    constructor(private databaseService: DatabaseService, private session: SessionStorageService) { 
        this.isLoggedIn = false;
    }

    ngOnInit() {
        if(this.session.retrieve("login") != null){
            this.isLoggedIn = true;
            this.userInformation = this.session.retrieve("login");
            console.log(this.userInformation);
        }
        this.createLoginControls();
        this.createLoginForm();
        this.createRegisterControls();
        this.createRegisterForm();
        this.getAllCountries();
    }

    createLoginForm() {
        this.loginForm = new FormGroup(
            {
                loginEmail: this.loginEmail,
                loginPassword: this.loginPassword
            }
        )
    }

    createLoginControls() {
        this.loginEmail = new FormControl();
        this.loginPassword = new FormControl();
    }

    checkLoginCredentials() {
        if (this.loginForm.valid) {
            this.databaseService.checkLoginCredentials(this.loginForm.value).subscribe(response => {
                if (response != "Error") {
                    this.session.store(
                        'login',
                        {
                            'id': response[0].id,
                            'first_name': response[0].first_name,
                            'last_name': response[0].last_name,
                            'email': response[0].email,
                            'photo': response[0].photo,
                            'type': 'log'
                        }
                    );
                    this.isLoggedIn = true;
                    window.location.reload();
                }
                else {
                    this.loginUnsuccess = true;
                }
            });
        }
    }

    createRegisterForm() {
        this.registerForm = new FormGroup({
            registerFirstName: this.registerFirstName,
            registerLastName: this.registerLastName,
            registerEmail: this.registerEmail,
            registerPassword: this.registerPassword,
            registerRepeatPassword: this.registerRepeatPassword,
            registerVille: this.registerVille
        })
    }

    createRegisterControls() {
        this.registerFirstName = new FormControl('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z]{4,10}')
        ]);
        this.registerLastName = new FormControl('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z]{4,10}')
        ]);
        this.registerEmail = new FormControl('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*\\.[a-zA-Z]{2,4}$')
        ]);
        this.registerPassword = new FormControl('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9]{4,10}$')

        ]);
        this.registerRepeatPassword = new FormControl('', [
            Validators.required
        ]);
        this.registerVille = new FormControl();
    }

    getAllCountries() {
        this.databaseService.getAllCountries().takeUntil(this.unsubscribe).subscribe(response => {
            if (response != "Error") {
                this.countries = response;
            }
        });
    }

    registerWithForm() {
        this.registerForm.value.registerVille = this.registerCity.nativeElement.value;
        if (this.registerForm.valid) {
            if (this.registerForm.value.registerPassword != this.registerForm.value.registerRepeatPassword) {
                this.passwordMismatch = true;
            }
            else {
                this.databaseService.registerWithForm(this.registerForm.value).takeUntil(this.unsubscribe)
                    .subscribe(response => {
                        this.isSuccess = response;
                        this.session.store('login', { 'id': response[0].id, 'first_name': response[0].first_name, 'last_name': response[0].last_name, 'email': response[0].email, 'type': 'log' })
                        this.isLoggedIn = true;
                        window.location.reload();
                    });
            }

        }
    }

    logout(){
        this.session.clear("login");
        window.location.reload();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
