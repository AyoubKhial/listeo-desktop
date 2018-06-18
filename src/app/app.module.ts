import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { Routing } from './app.routing';
import { DatabaseService } from './services/database/database.service';
import { HttpModule } from '@angular/http';
import { MailerService } from './services/mailer/mailer.service';
import { Ng2Webstorage } from 'ngx-webstorage';
import { ArticlesListingComponent } from './components/articles/articles-listing/articles-listing.component';
import { PagerService } from './services/pager/pager.service';
import { RestaurantsListingComponent } from './components/restaurants/restaurants-listing/restaurants-listing.component';
import { FormsModule } from '@angular/forms';
import { HotelsListingComponent } from './components/hotels/hotels-listing/hotels-listing.component';
import { RestaurantDetailComponent } from './components/restaurants/restaurant-detail/restaurant-detail.component';
import { RestaurantDirectionsComponent } from './components/restaurants/restaurant-directions/restaurant-directions.component';
import { ArticleDetailComponent } from './components/articles/article-detail/article-detail.component';
import { HotelDetailComponent } from './components/hotels/hotel-detail/hotel-detail.component';
import { HotelDirectionsComponent } from './components/hotels/hotel-directions/hotel-directions.component';
import { SocialLoginModule, AuthServiceConfig, LoginOpt } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { ContactComponent } from './components/contact/contact.component';
import { ShareModule } from '@ngx-share/core';
import { HttpClientModule } from '@angular/common/http';
import { MessagesComponent } from './components/profile/messages/messages.component';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { BookmarksComponent } from './components/profile/bookmarks/bookmarks.component';
import { AddRestaurantComponent } from './components/profile/add-restaurant/add-restaurant.component';
import { LeftNavigationComponent } from './components/profile/left-navigation/left-navigation.component';
import { AddHotelComponent } from './components/profile/add-hotel/add-hotel.component';
import { AddArticleComponent } from './components/profile/add-article/add-article.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MyProfileComponent } from './components/profile/my-profile/my-profile.component';


let config = new AuthServiceConfig([
	{
		id: GoogleLoginProvider.PROVIDER_ID,
		provider: new GoogleLoginProvider("928528225593-4nc30fu37k8giiqnv8ff0tlgp4omkmvf.apps.googleusercontent.com")
	},
	{
		id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("2164091820488016")
	},

]);

export function provideConfig() {
    return config;
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        ArticlesListingComponent,
        RestaurantsListingComponent,
        HotelsListingComponent,
        RestaurantDetailComponent,
        RestaurantDirectionsComponent,
        ArticleDetailComponent,
        HotelDetailComponent,
        HotelDirectionsComponent,
        ContactComponent,
        MessagesComponent,
        BookmarksComponent,
        AddRestaurantComponent,
        LeftNavigationComponent,
        AddHotelComponent,
        AddArticleComponent,
        MyProfileComponent
    ],
    imports: [
        BrowserModule,
        Routing,
        ReactiveFormsModule,
        HttpModule,
        Ng2Webstorage,
        FormsModule,
        SocialLoginModule,
        ShareModule.forRoot(),
        HttpClientModule,
        EditorModule
    ],
    providers: [
        DatabaseService,
        MailerService,
        PagerService,
        AuthGuardService,
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
