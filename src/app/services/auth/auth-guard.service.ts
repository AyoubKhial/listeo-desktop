import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(public session: SessionStorageService, public router: Router) { }

    canActivate(): boolean {
        if (this.session.retrieve("login") == null) {
            this.router.navigate(['home']);
            return false;
        }
        return true;
    }

}
