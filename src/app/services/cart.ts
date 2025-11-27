import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//para agregar por cantidad sin repetir
//el dato de la base solo la cantidad 
export interface CartItem {
    id: number; // id del item en DB
  product: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class Cart {
  
  private items: CartItem[] = [];
 
  /*versión frontend con localStorage 
  constructor() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.items = JSON.parse(storedCart);
    }
  }
  

  addToCart(product: any): void {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.saveCart();
  }

  getItems(): CartItem[] {
    return this.items;
  }

  removeFromCart(productId: number): void {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.saveCart();
  }

  clearCart(): void {
    this.items = [];
    this.saveCart();
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }


  //agregar cantidad 
 // desde el component del carrito directo
  increaseQuantity(productId: number): void {
  const item = this.items.find(i => i.product.id === productId);
  if (item) {
    item.quantity += 1;
    this.saveCart();
  }
}

  //quitar cantidad 
 // desde el component del carrito directo
decreaseQuantity(productId: number): void {
  const item = this.items.find(i => i.product.id === productId);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
    this.saveCart();
  } else if (item) {
    this.removeFromCart(productId); // elimina si llega a 0
  }
}
*/


  //version backend base de datos 


  
  private apiUrl = 'https://portfoliowebbackendkoyeb-1.onrender.com';

constructor(private http: HttpClient) {}

// Obtener carrito desde backend
getItems() {
  return this.http.get<CartItem[]>(`${this.apiUrl}/api/cart`);
}



// Eliminar producto
removeFromCart(cartItemId: number) {
  return this.http.delete(`${this.apiUrl}/remove/${cartItemId}`);
}

// Vaciar carrito
clearCart() {
  return this.http.delete(`${this.apiUrl}/clear`);
}

  // para aumentar items al carrito
increaseFromCart(productId: number) {
  return this.http.post(`${this.apiUrl}/increase`, { productId });
}
  //para disminuir items del carrito 
  
  decreaseFromCart(productId: number) {
  return this.http.post(`${this.apiUrl}/decrease`, { productId });
}


}

  

