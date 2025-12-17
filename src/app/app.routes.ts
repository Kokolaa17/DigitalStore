import { Routes } from '@angular/router';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { OrderPageComponent } from './Components/order-page/order-page.component';
import { DetailsPageComponent } from './Components/order-page/details-page/details-page.component';
import { UserPageComponent } from './Components/user-page/user-page.component';
import { CartPageComponent } from './Components/cart-page/cart-page.component';
import { detailsPageResolver } from './Resolvers/details-page.resolver';


export const routes: Routes = [
    {path: "", component: HomePageComponent},
    {
        path: "orderPage",
        loadComponent: () => import("./Components/order-page/order-page.component").then(m => m.OrderPageComponent), 
    },
    {
        path: "orderPage/detailsPage/:productID",
        loadComponent : () => import("./Components/order-page/details-page/details-page.component").then(m => m.DetailsPageComponent),
        resolve: {
            productDetails: detailsPageResolver
        }
    },
    {path: "userProfile", component: UserPageComponent},
    {path: "cart", component: CartPageComponent},   
];
