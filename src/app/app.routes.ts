import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { DetailsPageComponent } from './order-page/details-page/details-page.component';


export const routes: Routes = [
    {path: "", component: HomePageComponent},
    {path: "orderPage", component: OrderPageComponent},
    {path: "orderPage/detailsPage/:productID", component: DetailsPageComponent},
    
];
