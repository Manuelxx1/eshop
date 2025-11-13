import { Injectable } from '@angular/core';


//para agregar por cantidad sin repetir
//el dato de la base solo la cantidad 
export interface CartItem {
  product: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class Cart {
  
  private items: CartItem[] = [];
  
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
  
}
