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

    getAllActivatedArticles() : Observable<any>{
        return this.http.get('http://localhost/listeo-desktop/src/api/database/getAllActivatedArticles.php')
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Not found') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    getMostPopularArticles() : Observable<any>{
        return this.http.get('http://localhost/listeo-desktop/src/api/database/getMostPopularArticles.php')
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Not found') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    getArticlesByTitle(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getArticlesByTitle.php', data)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Not found') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    getAllActivatedRestaurants() : Observable<any>{
        return this.http.get('http://localhost/listeo-desktop/src/api/database/getAllActivatedRestaurants.php')
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Not found') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    orderRestaurants(data){
        return this.http.post('http://localhost/listeo-desktop/src/api/database/orderRestaurants.php', data)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Not found') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    getAllPrivileges() : Observable<any>{
        return this.http.get('http://localhost/listeo-desktop/src/api/database/getAllPrivileges.php')
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Not found') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    filterRestaurants(data){
        return this.http.post('http://localhost/listeo-desktop/src/api/database/filterRestaurants.php', data)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== '0') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    getAllActivatedHotels() : Observable<any>{
        return this.http.get('http://localhost/listeo-desktop/src/api/database/getAllActivatedHotels.php')
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Not found') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    orderHotels(data){
        return this.http.post('http://localhost/listeo-desktop/src/api/database/orderHotels.php', data)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Not found') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    filterHotels(data){
        return this.http.post('http://localhost/listeo-desktop/src/api/database/filterHotels.php', data)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== '0') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    getRestaurantDetails(restaurantId) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getRestaurantDetails.php', restaurantId)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Not found') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    getRestaurantBasicInformation(restaurantId) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getRestaurantBasicInformation.php', restaurantId)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Not found') {
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }

    getArticleDetails(articleId){
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getArticleDetails.php', articleId)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Not found') {
                    console.log(response.text());
                    return response.json();
                }
                else {
                    return response.text();
                }
            });
    }
}
