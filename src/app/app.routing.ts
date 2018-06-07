import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ArticlesListingComponent } from './components/articles/articles-listing/articles-listing.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'articles', component: ArticlesListingComponent },
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
