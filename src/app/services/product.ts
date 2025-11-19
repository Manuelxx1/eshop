import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id: number;
  productName: string;
  amount: number;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class Product {
  private apiUrl = 'https://portfoliowebbackendkoyeb-1.onrender.com/api/products/search';
private apiUrlOrders = 'https://portfoliowebbackendkoyeb-1.onrender.com/api/payments';
  constructor(private http: HttpClient) {}

  // Método para buscar productos por término
  searchProducts(term: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}?name=${term}`);
}

  // Método para crear la preferencia y devolver el orderId
  comprar(product: any): Observable<string> {
  return this.http.post(
    'https://portfoliowebbackendkoyeb-1.onrender.com/api/payments/create',
    product,
    { responseType: 'text' } //  esto evita el error de parsing
  );
}



  //para consultar el estado del pedido orders por id
  //que se registro en tabla orders
  //getOrder(id: number): Observable<Order> {
    //return this.http.get<Order>(`${this.apiUrlOrders}/orders/${id}`);
 // }

  

@GetMapping("/orders")
public List<Order> getOrders() {
    return orderRepository.findAll();
}

}
