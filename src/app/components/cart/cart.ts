import { Component,OnInit } from '@angular/core';
import { Cart } from '../../services/cart';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartList implements OnInit{
  items: any[] = [];
  total: number = 0;

  constructor(private cartService: Cart) {}

  ngOnInit() {
    const items = this.cartService.getCart();
  console.log('Carrito cargado:', items);
}
  clearCart() {
    this.items = this.cartService.clearCart();
    this.total = 0;
  }

}
