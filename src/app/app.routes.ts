import { Routes } from '@angular/router';
import { Homepage } from './feature/homepage/homepage';
import { Login } from './feature/login/login';
import { Cart } from './feature/cart/cart';

export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'home', component: Homepage },
  { path: 'cart', component: Cart },
  {path:'product/:id', loadComponent: () => import('./shared/components/product-details/product-details').then(m => m.ProductDetails)},
];
