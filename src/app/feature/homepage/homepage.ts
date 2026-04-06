import { Component, signal } from '@angular/core';
import { Card } from '../../shared/components/card/card';
import { Product } from '../../core/service/product';

@Component({
  selector: 'app-homepage',
  imports: [Card],
  standalone: true,
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  products = signal<any>([]);
  loading = signal<boolean>(true);
  constructor(private productService: Product) { };

  ngOnInit(){
    this.productService.getProducts().subscribe({
      next:(data:any)=>{
        this.products.set(data);
        this.loading.set(false);
        console.log("data",   this.products());
      },
      error:(err:any)=>{
        console.log("err", err?.message);
        this.loading.set(false);
      }
    })
  }
}
