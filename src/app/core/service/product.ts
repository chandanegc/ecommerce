import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { productIR } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class Product {
  url = "http://localhost:3000/products";
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<productIR[]>(this.url);
  }

  getProductById(id: string) {
    return this.http.get<productIR>(`${this.url}/${id}`);
  }
}
