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

loadCart(): void {
  this.cartService.getItems().subscribe({
    next: (data) => {
      this.items = data;
      this.total = this.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
    },
    error: (err) => {
      console.error('Error al cargar el carrito', err);
    }
  });
}

  


  increase(productId: number): void {
  this.cartService.increaseFromCart(productId).subscribe({
    next: () => this.loadCart(),
    error: err => console.error('Error al aumentar cantidad', err)
  });
}

decrease(productId: number): void {
  this.cartService.decreaseFromCart(productId).subscribe({
    next: () => this.loadCart(),
    error: err => console.error('Error al disminuir cantidad', err)
  });
}

remove(cartItemId: number): void {
  this.cartService.removeFromCart(cartItemId).subscribe({
    next: () => this.loadCart(),
    error: err => console.error('Error al eliminar producto', err)
  });
}


  clear() {
    this.cartService.clearCart().subscribe(() => {
      this.loadCart();
    });
  }



}
