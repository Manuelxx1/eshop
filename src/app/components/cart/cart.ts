import { Component } from '@angular/core';
import { Cart } from '../../services/cart';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  items = this.cartService.getItems();
  total = this.cartService.getTotal();

  constructor(private cartService: Cart) {}

  clearCart() {
    this.items = this.cartService.clearCart();
    this.total = 0;
  }

}
