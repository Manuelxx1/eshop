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
    this.loadCart();
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

loadCart() {
  this.cartService.getItems().subscribe(items => {
    this.items = items;
    this.total = this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  });
}

  
add(productId: number) {
    this.cartService.addToCart(productId, 1).subscribe(() => {
      this.loadCart();
    });
  }

  increase(productId: number) {
    this.cartService.increaseFromCart(productId).subscribe(() => {
      this.loadCart();
    });
  }

  decrease(productId: number) {
    this.cartService.decreaseFromCart(productId).subscribe(() => {
      this.loadCart();
    });
  }

  remove(cartItemId: number) {
    this.cartService.removeFromCart(cartItemId).subscribe(() => {
      this.loadCart();
    });
  }

  clear() {
    this.cartService.clearCart().subscribe(() => {
      this.loadCart();
    });
  }



}
