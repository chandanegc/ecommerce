import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductStore } from '../../../store/product.store';
import { CartStore } from '../../../store/cart.store';
import { Product } from '../../models/product.model';
import { ProductService } from '../../../core/service/product.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private productStore = inject(ProductStore);
  private cartStore = inject(CartStore);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  item = signal<Product | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;

    // First try to get product from the global store (no extra API call)
    const fromStore = this.productStore.getProductById(id);
    if (fromStore) {
      this.item.set(fromStore);
      return;
    }

    // Fallback: fetch from API if store isn't populated yet
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.item.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  addToCart(): void {
    const product = this.item();
    if (product) {
      this.cartStore.addToCart(product);
    }
  }
}
