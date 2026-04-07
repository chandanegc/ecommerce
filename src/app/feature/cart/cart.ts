import { Component, inject } from '@angular/core';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  protected cartStore = inject(CartStore);

  removeItem(id: number): void {
    this.cartStore.removeFromCart(id);
  }

  checkout(): void {
    this.cartStore.clearCart();
  }
}
