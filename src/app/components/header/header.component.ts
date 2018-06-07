import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
	public loggedIn: boolean;
	public isSuccess: string;
	public loginUnsuccess: boolean;
    private unsubscribe = new Subject<void>();
    
    constructor(private databaseService: DatabaseService, private session: SessionStorageService) { }

    ngOnInit() {
        this.createLoginControls();
        this.createLoginForm();
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
    
    checkAuth() {
		if (this.loginForm.valid) {
			this.databaseService.checkLoginCredentials(this.loginForm.value).subscribe(response => {
				if (response != "0") {
                    this.session.store('login', {'id': response[0].id, 'first_name': response[0].first_name, 'last_name': response[0].last_name, 'email': response[0].email, 'type': 'log'})
					window.location.reload();
				}
				else {
					this.loginUnsuccess = true;
				}
			});
		}
    }
    
    ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

}
