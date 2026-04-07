import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartStore } from '../../../store/cart.store';
import { ProductStore } from '../../../store/product.store';

@Component({
  selector: 'header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected cartStore = inject(CartStore);
  protected productStore = inject(ProductStore);

  search(query: string): void {
    this.productStore.searchProducts(query.trim());
  }
}
