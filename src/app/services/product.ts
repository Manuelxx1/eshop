import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


//en la interface definimos el tipado de los datos
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
  category: string;
  imageUrl: string;
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
  mpPayerName: string;
  mpPayerEmail: string;
  total: number;
  amount: number;
  status: string;
  productName: string;
  createdAt: string;
  loginUsername:String;
  externalReference: string; // <-- NUEVO campo compra exitosa   items: OrderItem[];
installments: number;
  installmentAmount: number;
  totalPaidAmount: number;
  items: OrderItem[];
}

@Injectable({
  providedIn: 'root',
})
export class Product {

 

  
  



  


  

  
//private apiUrl = 'https://portfoliowebbackendkoyeb-1.onrender.com/api/products/search';

private apiUrl = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/products/search';


//private apiUrlOrders = 'https://portfoliowebbackendkoyeb-1.onrender.com/api/payments';
  
  private apiUrlOrders = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/payments';

  
  constructor(private http: HttpClient) { }//constructor


  
  
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
  return this.http.post(this.apiURLogin, datosdesesion,{ observe: 'response' } );//  Esto hace que Angular devuelva el objeto completo de la respuesta
}

//2FA validar codigo
  
  private baseUrl2FA = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/2fa';
validateCode(email: string, code: string): Observable<any> {
 alert ("datos 2fa en el servicio"+email+code);
  return this.http.post(
    `${this.baseUrl2FA}/validate?email=${email}&code=${code}`,
    null, // body vacío
    { observe: 'response' } //  opciones correctas
  );
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
comprar(productId: number, quantity: number, idUsuario: number | null, formData: any): Observable<string> {
  const body = { 
    quantity, 
    idUsuario, 
    /*shippingType: shippingOption.id,   //  extraer id del objeto
    shippingCost: shippingOption.price, // extraer precio del objeto 
 shippingName: shippingOption.name*/
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
    `https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/payments/create/${productId}`,
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


  private apiOrderEstadoDeCompra = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/payments';

getOrderEstadoDeCompra(externalReference: string): Observable<Order> {
  return this.http.get<Order>(`${this.apiOrderEstadoDeCompra}/orders/estado/${externalReference}`);
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

//metodo section productos destacados de eshop mocking
/*
  getFeaturedProducts() {
    return [
      { name: 'Notebook Gamer', price: 350000, imageUrl: '/img/n14p4020_7.jpg' },
      { name: 'Smartphone 5G', price: 220000, imageUrl: '/img/images.jpeg' },
      { name: 'Auriculares Bluetooth', price: 45000, imageUrl: '/img/AURICULARES_NAU-Y100-BG.png' },
      { name: 'Smart TV 50"', price: 280000, imageUrl: '/img/8d3e2970952c5d19e40c1df29ec6.jpg' }
    ];
  }
  */
  private apiUrlFeaturedProducts= 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/destacados';
  
  getFeaturedProducts():Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrlFeaturedProducts);
    
  }

  //productos según categorías usando un mocking
 /* 
  private products = [
    { name: 'iPhone 15', price: 1200000, imageUrl: 'img/celulares.jpg', category: 'celulares' },
    { name: 'Samsung Galaxy S23', price: 950000, imageUrl: 'img/celulares.jpg', category: 'celulares' },
    { name: 'Notebook Gamer', price: 1500000, imageUrl: 'img/computadoras.jpg', category: 'computadoras' },
    { name: 'Smart TV 50"', price: 800000, imageUrl: 'img/tv.jpg', category: 'tv' },
    { name: 'Auriculares Bluetooth', price: 45000, imageUrl: 'img/accesorios.jpg', category: 'accesorios' }
  ];


  getProductsByCategory(category: string) {
    return this.products.filter(p => p.category === category);
  }

*/

  //productos por categoría 

private apiUrlProductsByCategory = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/category';
  
  getProductsByCategory(category: string): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrlProductsByCategory}/${category}`);
}

  
  private apiUrlTodosLosProductos = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/todoslosproductos';
  // Trae todos los productos
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrlTodosLosProductos);
  }

}
