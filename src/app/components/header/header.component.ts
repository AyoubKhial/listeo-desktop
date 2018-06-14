import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import { DatabaseService } from '../../services/database/database.service';
import { SessionStorageService } from 'ngx-webstorage';
import { AuthService, SocialUser, FacebookLoginProvider } from 'angularx-social-login';
import { GoogleLoginProvider } from "angularx-social-login";




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
    public isSuccess: boolean;
    public loginUnsuccess: boolean;
    public countries: Object;
    public passwordMismatch: boolean;
    public isLoggedIn: boolean;
    public userInformation;
    private unsubscribe = new Subject<void>();
    private authUser: SocialUser;

    constructor(private databaseService: DatabaseService, private session: SessionStorageService, private authService: AuthService) {
        this.isSuccess = false;
    }


    ngOnInit() {
        if (this.session.retrieve("login") != null) {
            this.isLoggedIn = true;
            this.userInformation = this.session.retrieve("login");
        }
        this.createLoginControls();
        this.createLoginForm();
        this.createRegisterControls();
        this.createRegisterForm();
        this.getAllCountries();
        this.authService.authState.subscribe((user) => {
            this.authUser = user;
        });
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
        this.loginEmail = new FormControl('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*\\.[a-zA-Z]{2,4}$')
        ]);
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
                            'type': response[0].provider
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

    registerWithForm(user) {
        if (user.type != null) {
            this.registerForm.value.registerVille = this.registerCity.nativeElement.value;
            this.registerForm.value.provider = "LISTEO";
            if (this.registerForm.valid) {
                if (this.registerForm.value.registerPassword != this.registerForm.value.registerRepeatPassword) {
                    this.passwordMismatch = true;
                }
                else {
                    this.databaseService.registerWithForm(this.registerForm.value).takeUntil(this.unsubscribe)
                        .subscribe(response => {
                            if(response == "Already exists"){
                                this.isSuccess = true;
                            }
                            else{
                                this.session.store('login', { 'id': response[0].id, 'first_name': response[0].first_name, 'last_name': response[0].last_name, 'email': response[0].email, 'type': 'listeo' })
                                this.isLoggedIn = true;
                                window.location.reload();
                            }
                        });
                }
            }
        }
        if (user.provider != null) {
            this.databaseService.registerWithForm(user).takeUntil(this.unsubscribe)
                .subscribe(response => {
                    if(user.provider == "GOOGLE"){
                        if(response == 'Already exists'){
                            this.isSuccess = true;
                        }
                        else{
                            this.session.store('login', { 'id': response[0].id, 'first_name': response[0].first_name, 'last_name': response[0].last_name, 'email': response[0].email, 'photo': response[0].photo,'type': 'google' })
                            this.isLoggedIn = true;
                            window.location.reload();
                        }
                    }
                    if(user.provider == "FACEBOOK"){
                        if(response == 'Already exists'){
                            this.isSuccess = true;
                        }
                        else{
                            this.session.store('login', { 'id': response[0].id, 'first_name': response[0].first_name, 'last_name': response[0].last_name, 'email': response[0].email, 'photo': response[0].photo,'type': 'facebook' })
                            this.isLoggedIn = true;
                            window.location.reload();
                        }
                    }
                });
        }
    }

    logout() {
        this.session.clear("login");
        window.location.reload();
    }

    signInWithGoogle(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(response => {
            this.registerWithForm(response)
        });
    }

    signInWithFB(): void {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(response => {
            this.registerWithForm(response)
        });;
    }

    signOut(): void {
        this.authService.signOut();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
