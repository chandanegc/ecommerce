import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Cart } from '../../../core/service/cart';

@Component({
  selector: 'header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(public cart: Cart) {};


}
