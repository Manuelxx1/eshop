import { Component,OnInit } from '@angular/core';
import { Cart } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../services/cart'; // ajustá el path si hace falta


@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartList implements OnInit{
  items: CartItem[] = [];

  total: number = 0;

  constructor(private cartService: Cart) {}

  ngOnInit() {
/*versión localStorage 
  this.items = this.cartService.getItems();
  this.total = this.cartService.getTotal();
  */
    this.cartService.getItems().subscribe(data => {
    this.items = data;
    this.total = this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  });
}

clearCart() {
  this.cartService.clearCart().subscribe(() => {
    this.items = [];
    this.total = 0;
  });
}

//métodos para agregar o quitar items 
  //directamente desde el carrito localStorage 
/*
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
*/

  //version backend 
increase(productId: number) {
  this.cartService.addToCart(productId, 1).subscribe(() => {
    // Una vez que el backend confirma, recargamos el carrito
    this.cartService.getItems().subscribe(items => {
      this.items = items;
      this.total = this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    });
  });
}

  //para quitar items del carrito 
decrease(productId: number) {
  this.cartService.decreaseFromCart(productId).subscribe(() => {
    this.cartService.getItems().subscribe(items => {
      this.items = items;
      this.total = this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    });
  });
}



}
