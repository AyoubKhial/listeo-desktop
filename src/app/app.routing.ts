import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ArticlesListingComponent } from './components/articles/articles-listing/articles-listing.component';
import { RestaurantsListingComponent } from './components/restaurants/restaurants-listing/restaurants-listing.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'articles', component: ArticlesListingComponent },
    { path: 'restaurants', component: RestaurantsListingComponent }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
