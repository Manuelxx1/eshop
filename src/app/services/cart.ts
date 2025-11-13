import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private items: any[] = [];
  constructor() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.items = JSON.parse(storedCart);
    }
  }

  addToCart(product: any) {
    this.items.push(product);
    this.saveCart()
  }

  getItems() {
    return this.items;
  }
  removeFromCart(productId: number): void {
    this.items = this.items.filter(p => p.id !== productId);
    this.saveCart();
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
  
}
