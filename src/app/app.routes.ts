import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { OrderPageComponent } from './order-page/order-page.component';

export const routes: Routes = [
    {
        path: "", component: HomePageComponent
    },
    {
        path: "orderPage", component: OrderPageComponent
    },
    
];
