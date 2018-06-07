import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class DatabaseService {

    hasResult: any;

    constructor(private http: Http) { }

    addSubscriber(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/addSubscriber.php', data)
            .map(response => {
                return response.text();
            });
    }

    checkLoginCredentials(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/checkLoginCredentials.php', data)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Error') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    registerWithForm(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/registerWithForm.php', data)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Error' && this.hasResult._body !== 'Already exists') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    getAllCountries() {
        return this.http.get('http://localhost/listeo-desktop/src/api/database/getAllCountries.php')
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Error') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

}
