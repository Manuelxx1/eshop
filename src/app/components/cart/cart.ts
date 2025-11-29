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
//items o productos del carrito para comprar 
  cart: any[] = [];
  total: number = 0;
  errorredir: string | null = null;

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

  
//método para compra por carrito 
  
comprarCarrito() {
  const cartItems = this.items.map(item => ({
    productId: item.product.id,   // usar el id del producto
    quantity: item.quantity
  }));

  alert("Botón comprar clickeado");

  

  this.cartService.comprarCarrito(cartItems).subscribe({
    next: initPoint => {
      alert("initPoint recibido: " + initPoint);
     // localStorage.setItem('selectedProduct', JSON.stringify(productId));

      // redirige al checkout de Mercado Pago
      window.location.href = initPoint;
      // Si en Android no abre, probá con:
      // window.open(initPoint, "_blank");
    },
    error: err => {
      alert("Error al llamar al backend: " + JSON.stringify(err));
      this.errorredir=JSON.stringify(err);
    }
  });
}

 getSubtotal(item: CartItem): number {
  return item.product.price * item.quantity;
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
