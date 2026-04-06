import { Component, Input } from '@angular/core';
import { Cart } from '../../../core/service/cart';

@Component({
  selector: 'card',
  standalone: true,
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input() item:any={};

  constructor(private cart: Cart) {}


  addToCart(item: any) {
    this.cart.addToCart(item);
  }

}
