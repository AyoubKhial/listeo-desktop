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
                    console.log(response.text());
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

    getAllActivatedArticles(): Observable<any> {
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

    getMostPopularArticles(): Observable<any> {
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

    getAllActivatedRestaurants(userId): Observable<any> {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getAllActivatedRestaurants.php', userId)
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

    orderRestaurants(data) {
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

    getAllPrivileges(): Observable<any> {
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

    filterRestaurants(data) {
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

    getAllActivatedHotels(userId): Observable<any> {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getAllActivatedHotels.php', userId)
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

    orderHotels(data) {
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

    filterHotels(data) {
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

    getRestaurantDetails(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getRestaurantDetails.php', data)
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

    getArticleDetails(articleId) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getArticleDetails.php', articleId)
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

    getHotelDetails(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getHotelDetails.php', data)
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

    getHotelBasicInformation(hotelId) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getHotelBasicInformation.php', hotelId)
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

    addToFavoris(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/addToFavoris.php', data)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Error') {
                    return response.text();
                }
                else {
                    return response.text();
                }
            });
    }

    getTopRatedLocations(user): Observable<any> {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getTopRatedLocations.php', user)
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

    getLastArticles(): Observable<any> {
        return this.http.get('http://localhost/listeo-desktop/src/api/database/getLastArticles.php')
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

    getSiteInformation(): Observable<any> {
        return this.http.get('http://localhost/listeo-desktop/src/api/database/getSiteInformation.php')
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Not found') {
                    response = JSON.parse(response.text());
                    return response;
                }
                else {
                    return response.text();
                }
            });
    }

    contactUs(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/contactUs.php', data)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Error') {
                    return response.text();
                }
                else {
                    return response.text();
                }
            });
    }

    addRestaurantComment(data, options) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/addRestaurantComment.php', data, options)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Error') {
                    return response.text();
                }
                else {
                    return response.text();
                }
            });
    }

    addHotelComment(data, options) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/addHotelComment.php', data, options)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Error') {
                    return response.text();
                }
                else {
                    return response.text();
                }
            });
    }

    addArticleComment(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/addArticleComment.php', data)
            .map(response => {
                this.hasResult = response;
                if (this.hasResult._body !== 'Error') {
                    return response.text();
                }
                else {
                    return response.text();
                }
            });
    }
    sendMessageToHost(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/sendMessageToHost.php', data)
            .map(response => {
                return response.text();
            });
    }

    getMessages(receiverId) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getMessages.php', receiverId)
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

    getBookmarks(userId) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getBookmarks.php', userId)
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

    getAllCategories() {
        return this.http.get('http://localhost/listeo-desktop/src/api/database/getAllCategories.php')
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

    addRestaurant(data, options) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/addRestaurant.php', data, options)
            .map(response => {
                return response.text();
            });
    }

    addHotel(data, options) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/addHotel.php', data, options)
            .map(response => {
                return response.text();
            });
    }

    getAllTags(): Observable<any> {
        return this.http.get('http://localhost/listeo-desktop/src/api/database/getAllTags.php')
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

    addArticle(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/addArticle.php', data)
            .map(response => {
                return response.text();
            });
    }

    getUserInformation(userId): Observable<any> {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/getUserInformation.php', userId)
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

    changeUserInformation(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/changeUserInformation.php', data)
            .map(response => {
                return response.text();
            });
    }

    changePassword(data) {
        return this.http.post('http://localhost/listeo-desktop/src/api/database/changePassword.php', data)
            .map(response => {
                return response.text();
            });
    }
}
