import { Injectable } from '@angular/core';
import { Alerts } from './alerts';

@Injectable({
  providedIn: 'root',
})
export class Cart {

  private STORAGE_KEY = 'cart';

  constructor(public alerts: Alerts) {
    this.loadCart();
  }

  cartItems: {
    id: number;
    name: string;
    price: number;
    description: string;
    img: string;
    quantity: number;
  }[] = []; 

  get cartCount() {
    return this.cartItems.length;
  }

  addToCart(item: any) {
    const existingItem = this.cartItems.find(p => p.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({
        ...item,
        price: Number(item.price),
        quantity: 1
      });
    }

    this.saveCart();
    this.alerts.notify("Added into cart", "success");
  }

  removeFromCart(id: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);

    this.saveCart();
    this.alerts.notify("Removed from cart", "success");
  }

  emptyCart() {
    this.cartItems = [];

    localStorage.removeItem(this.STORAGE_KEY);
    this.alerts.notify("Cart cleared", "success");
  }

  private saveCart() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems));
  }

  private loadCart() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      this.cartItems = JSON.parse(data);
    }
  }
}
