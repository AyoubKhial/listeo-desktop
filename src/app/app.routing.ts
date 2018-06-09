import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ArticlesListingComponent } from './components/articles/articles-listing/articles-listing.component';
import { RestaurantsListingComponent } from './components/restaurants/restaurants-listing/restaurants-listing.component';
import { HotelsListingComponent } from './components/hotels/hotels-listing/hotels-listing.component';
import { RestaurantDetailComponent } from './components/restaurants/restaurant-detail/restaurant-detail.component';
import { RestaurantDirectionsComponent } from './components/restaurants/restaurant-directions/restaurant-directions.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'articles', component: ArticlesListingComponent },
    { path: 'restaurants', component: RestaurantsListingComponent },
    { path: 'hotels', component: HotelsListingComponent },
    { path: 'restaurants/:id', component: RestaurantDetailComponent },
    { path: 'restaurants/:id/directions', component: RestaurantDirectionsComponent },
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
