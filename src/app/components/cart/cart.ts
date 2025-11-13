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

  this.items = this.cartService.getItems();
  this.total = this.cartService.getTotal();
}


  clearCart() {
  this.cartService.clearCart();
  this.items = [];
  this.total = 0;
}
//métodos para agregar o quitar items 
  //directamente desde el carrito
  increase(productId: number) {
  this.cartService.increaseQuantity(productId);
  this.items = this.cartService.getItems();
  this.total = this.cartService.getTotal();
}

decrease(productId: number) {
  this.cartService.decreaseQuantity(productId);
  this.items = this.cartService.getItems();
  this.total = this.cartService.getTotal();
}


}
