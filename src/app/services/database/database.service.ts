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
            .map(res => {
                return res.text();
            });
    }

    checkLoginCredentials(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/checkLoginCredentials.php', data)
            .map(res => {
                this.hasResult = res;
                if (this.hasResult._body !== '0') {
                    return res.json();
                }
                else {
                    return res.text();
                }
            });
    }
}