import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//Notifications mediante websocket/stomp 
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

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
  loginUsername:String;
}

@Injectable({
  providedIn: 'root',
})
export class Product {

  public stompClient: Client;

  
  



  


  

  
//private apiUrl = 'https://portfoliowebbackendkoyeb-1.onrender.com/api/products/search';

private apiUrl = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/products/search';


//private apiUrlOrders = 'https://portfoliowebbackendkoyeb-1.onrender.com/api/payments';
  
  private apiUrlOrders = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/payments';

  
  constructor(private http: HttpClient) {
      
    //notificaciones mediante websocket/stomp 


    this.stompClient = new Client({ //  corregí la URL: no puede ser "ws://https://..."
     // brokerURL: 'wss://portfoliowebbackendkoyeb-1-ulka.onrender.com/ws', // ejemplo si tu backend corre en localhost
      reconnectDelay: 5000, 
      debug: (str) => console.log(str),
 webSocketFactory: () => new SockJS('https://portfoliowebbackendkoyeb-1-ulka.onrender.com/ws'), // fallback SockJS
      });
      this.stompClient.onConnect = () => { console.log(' Conectado al servidor WebSocket');
   };
    this.stompClient.activate();
  
  }//constructor

/*
  // Método para enviar mensajes al backend
  sendNotification(payload: string) { this.stompClient.publish({ destination: '/app/notify', body: payload, }); }
*/
  
  // Método para buscar productos por término
  searchProducts(term: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}?name=${term}`);
}

  //formulario login método
  private apiURLogin = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/loginsinjwteshop';

// Service de Angular (CORREGIDO)
// Usa el nombre de la propiedad que espera el backend para buscar al usuario.
iniciarSesion(username: string, password: string): Observable<any> {
  const datosdesesion = { username, password }; // Usando 'username'
  return this.http.post(this.apiURLogin, datosdesesion);
}

  //formulario registro método
  private apiURLRegistro = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/registereshop';

registrarDatos(user: any): Observable<any> {
  alert(" del service " + JSON.stringify(user));
  // user debería tener { username, email, name, password }
  return this.http.post(this.apiURLRegistro, user);
}

    
  // Método para crear la preferencia y devolver el orderId
// Método para crear la preferencia y devolver el initPoint
comprar(productId: number, quantity: number, idUsuario: number | null): Observable<string> {
  const body = { quantity, idUsuario };
  return this.http.post(`https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/payments/create/${productId}`,
    body,
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

  private apiUrlHistorial = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/payments/orders';
  
  getOrdersByLogin(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlHistorial}/byLogin/${idUsuario}`);
}

private apiUrlPassword = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com';
  
  updatePassword(username: string, password: string): Observable<any> {
  return this.http.put(`${this.apiUrlPassword}/change-password`, {
    username: username,
    password: password
  });
}

  private apiUrlUsername = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com';
  
    // Cambiar username
  updateUsername(id: number, nuevoUsername: string): Observable<any> {
  return this.http.put(`${this.apiUrlUsername}/update-username`, {
    id: id,                 // referencia estable
    newUsername: nuevoUsername // valor nuevo
  });
}

private apiUrlEmail = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com';
  
    // Cambiar username
  updateEmail(id: number, nuevoEmail: string): Observable<any> {
  return this.http.put(`${this.apiUrlEmail}/update-email`, {
    id: id,                 // referencia estable
    email: nuevoEmail // valor nuevo
  });
}



  
  

}
