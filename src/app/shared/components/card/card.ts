import { Component, Input } from '@angular/core';
import { CartStore } from '../../../store/cart.store';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { inject } from '@angular/core';

@Component({
  selector: 'card',
  standalone: true,
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() item!: Product;

  private cartStore = inject(CartStore);
  private router = inject(Router);

  addToCart(item: Product): void {
    this.cartStore.addToCart(item);
  }

  navigate(id: number | string): void {
    this.router.navigate([`product/${id}`]);
  }
}
