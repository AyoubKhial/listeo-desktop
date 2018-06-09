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
import {Ng2Webstorage} from 'ngx-webstorage';
import { ArticlesListingComponent } from './components/articles/articles-listing/articles-listing.component';
import { PagerService } from './services/pager/pager.service';
import { RestaurantsListingComponent } from './components/restaurants/restaurants-listing/restaurants-listing.component';
import { FormsModule } from '@angular/forms';
import { HotelsListingComponent } from './components/hotels/hotels-listing/hotels-listing.component';
import { RestaurantDetailComponent } from './components/restaurants/restaurant-detail/restaurant-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        ArticlesListingComponent,
        RestaurantsListingComponent,
        HotelsListingComponent,
        RestaurantDetailComponent
    ],
    imports: [
        BrowserModule,
        Routing,
        ReactiveFormsModule,
        HttpModule,
        Ng2Webstorage,
        FormsModule
    ],
    providers: [
        DatabaseService,
        MailerService,
        PagerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
