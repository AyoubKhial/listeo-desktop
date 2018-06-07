import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class MailerService{

    constructor(private http: Http){}

    successfulSubscribe(email: string) {
        return this.http.post("http://localhost/listeo-desktop/src/api/mailer/successfulSubscribe.php", email)
        .map(response => {
                console.log('Sending email was successfull', response);
                return response;
        })
    }
}