import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ArticlesListingComponent } from './components/articles/articles-listing/articles-listing.component';
import { RestaurantsListingComponent } from './components/restaurants/restaurants-listing/restaurants-listing.component';
import { HotelsListingComponent } from './components/hotels/hotels-listing/hotels-listing.component';
import { RestaurantDetailComponent } from './components/restaurants/restaurant-detail/restaurant-detail.component';
import { RestaurantDirectionsComponent } from './components/restaurants/restaurant-directions/restaurant-directions.component';
import { ArticleDetailComponent } from './components/articles/article-detail/article-detail.component';
import { HotelDetailComponent } from './components/hotels/hotel-detail/hotel-detail.component';
import { HotelDirectionsComponent } from './components/hotels/hotel-directions/hotel-directions.component';
import { ContactComponent } from './components/contact/contact.component';
import { MessagesComponent } from './components/profile/messages/messages.component';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { BookmarksComponent } from './components/profile/bookmarks/bookmarks.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'articles', component: ArticlesListingComponent },
    { path: 'restaurants', component: RestaurantsListingComponent },
    { path: 'hotels', component: HotelsListingComponent },
    { path: 'restaurants/:id', component: RestaurantDetailComponent },
    { path: 'restaurants/:id/directions', component: RestaurantDirectionsComponent },
    { path: 'articles/:id', component: ArticleDetailComponent },
    { path: 'hotels/:id', component: HotelDetailComponent },
    { path: 'hotels/:id/directions', component: HotelDirectionsComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'profile/messages', component: MessagesComponent, canActivate: [AuthGuardService] },
    { path: 'profile/bookmarks', component: BookmarksComponent, canActivate: [AuthGuardService] }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
