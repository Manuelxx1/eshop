import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//para el carrito sin sesión 
import { BehaviorSubject } from 'rxjs';
 
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
  /*cartCount es el BehaviorSubject interno,
  donde se hace .next() para actualizar*/
  private cartCount = new BehaviorSubject<number>(0);

/*cartCount$ es la versión observable que se expone a los componentes.
El $ en el nombre no es obligatorio, pero es una convención de estilo 
para que al leer el código sepas que esa variable es un observable
y no un valor normal
En resumen: cartCount$ es simplemente un observable del contador del carrito, 
y el $ es solo un nombre de variable que te ayuda a distinguirlo.
*/
  
  cartCount$ = this.cartCount.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
total$ = this.totalSubject.asObservable();

  
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


  
 // private apiUrl = 'https://portfoliowebbackendkoyeb-1.onrender.com';
  private apiUrl = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com';

constructor(private http: HttpClient) {
  // Al iniciar, cargamos lo que haya en localStorage
    const savedItems = localStorage.getItem('cartItems');
    if (savedItems) {
      this.items = JSON.parse(savedItems);
      this.cartCount.next(this.items.length);
    }

}
  
// Obtener carrito desde backend
/*getItems() {
  return this.http.get<CartItem[]>(`${this.apiUrl}/api/cart`);
}*/
  
getItems() {
  const idUsuario = localStorage.getItem('idUsuario');
  return this.http.get<CartItem[]>(`${this.apiUrl}/api/cart`, {
    params: { idUsuario: idUsuario! }
  });
}
 
  // Método para visitantes sin sesión
  addItem(product: any, quantity: number) {
  const cartItem: CartItem = {
    id: product.id,
    product, quantity
  };
  this.items.push(cartItem);
  this.updateStorage();
}


  getItemsSinSession() {
    return this.items;
  }
  
  //Método para eliminar un producto por índice
  removeItem(index: number) {
    if (index > -1 && index < this.items.length) {
      this.items.splice(index, 1); // elimina el item
      this.updateStorage();        // actualiza localStorage y contador
    }
  }
  clearCartSinSession() {
    this.items = [];
    this.updateStorage();
  }

  private itemsSubject = new BehaviorSubject<any[]>([]);
items$ = this.itemsSubject.asObservable();

  private updateStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
    this.cartCount.next(this.items.length);
    this.totalSubject.next(this.getTotal()); // recalculamos subtotal
    this.itemsSubject.next([...this.items]); // emitir nueva lista 
  }              
  
  }

    // ver el total del carrito sin session 
getTotal(): number {
  return this.items.reduce((acc, item) => {
    const price = item.product.price || 0; // asumimos que el producto tiene un campo "price"
    return acc + price * item.quantity;
  }, 0);
}

  // Método para comprar el carrito
comprarCarrito(cartItems: any[], idUsuario: number, formData: any): Observable<string> {
  const body = { 
    items: cartItems,
    idUsuario, 
    name: formData.name, 
    email: formData.email,
    phone: formData.phone, 
    address: formData.address, 
    city: formData.city,
    postalCode: formData.postalCode, 
    shippingType: formData.shippingOption.id,
    shippingCost: formData.shippingOption.price, 
    shippingName: formData.shippingOption.name
  };

  console.log("Body enviado:", body);

  return this.http.post(
    `https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/payments/comprarCarrito`,
    body,
    { responseType: 'text' }
  );
}



  //este método está en AbmlcontrollerApplication 
//para agregar items al carrito es usado 
  //por ProductList component 
  //se usa este service que es de cart porque esta conectado
  //a la tabla cart_items y el de productlist no lo esta
addToCart(productId: number, quantity: number,idUsuario:number): Observable<any> {
  return this.http.post(`${this.apiUrl}/add`, { productId, quantity,idUsuario });
}


  
  
  //Estos métodos usa el carrito
    //estos métodos están en AbmlcontrollerApplication 
// Eliminar producto
removeFromCart(productId: number, userId: number) {
  return this.http.post(`${this.apiUrl}/remove`, { productId, userId });
}

// Vaciar carrito
clearCart(userId: number) {
  return this.http.post(`${this.apiUrl}/clear`, { userId });
}

  // para aumentar items al carrito
increaseFromCart(productId: number, userId: number) {
  return this.http.post(`${this.apiUrl}/increase`, { productId, userId });
}

  //para disminuir items del carrito 
  
  decreaseFromCart(productId: number, userId: number) {
  return this.http.post(`${this.apiUrl}/decrease`, { productId, userId });
  }

}

  

