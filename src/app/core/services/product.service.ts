import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly url = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<Product[]>(this.url);
  }

  getProductById(id: string) {
    return this.http.get<Product>(`${this.url}/${id}`);
  }
}
