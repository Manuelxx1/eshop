import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  amount: number;
  productName: string;
}

export interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  total: number;
  amount: number;
  status: string;
  productName: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class Product {
 
  
//private apiUrl = 'https://portfoliowebbackendkoyeb-1.onrender.com/api/products/search';

private apiUrl = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/products/search';


//private apiUrlOrders = 'https://portfoliowebbackendkoyeb-1.onrender.com/api/payments';
  
  private apiUrlOrders = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/payments';
  constructor(private http: HttpClient) {}

  // Método para buscar productos por término
  searchProducts(term: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}?name=${term}`);
}

  // Método para crear la preferencia y devolver el orderId
// Método para crear la preferencia y devolver el initPoint
comprar(product: any, quantity: number): Observable<string> {
  return this.http.post(
    `https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/payments/create/${product.id}`,
    { quantity }, // ahora sí enviamos la cantidad seleccionada
    { responseType: 'text' }
  );
}





  //para consultar el estado del pedido orders por id
  //que se registro en tabla orders
  //getOrder(id: number): Observable<Order> {
    //return this.http.get<Order>(`${this.apiUrlOrders}/orders/${id}`);
 // }

  

getOrders(): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.apiUrlOrders}/orders`);
}

}
