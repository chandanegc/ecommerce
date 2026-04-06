import { Component } from '@angular/core';
import { Cart as ServiceCart } from '../../core/service/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  constructor(public cart: ServiceCart) {}

  get cartItems() {
    return this.cart.cartItems;
  }

  removeToCart(id: number) {
    this.cart.removeFromCart(id);
  }

  checkout(){
    this.cart.emptyCart();
  }
}
