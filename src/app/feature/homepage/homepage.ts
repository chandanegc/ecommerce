import { Component, inject, OnInit } from '@angular/core';
import { Card } from '../../shared/components/card/card';
import { ProductStore } from '../../store/product.store';

@Component({
  selector: 'app-homepage',
  imports: [Card],
  standalone: true,
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit {
  protected store = inject(ProductStore);

  ngOnInit(): void {
    this.store.loadProducts();
  }

  filterProducts(category: string): void {
    this.store.filterByCategory(category);
  }
}
