import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


//en la interface definimos el tipado de los datos
//que refleja  la estructura tal cual viene del backend
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
}

export interface Section {
  id: number;
  name: string;
}

export interface Categories {
  id: number;
  name: string;
}

export interface Product {
  id?: number;   // opcional, lo genera la base
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Categories;
  section: Section; //  objeto Section completo
  imageUrl: string;
  createdAt: Date;   //string o Date
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


//para backoffice 
//en un proyecto real conviene separar 
//las tres interfaces 
//en un archivo a parte del servicio
//src/app/models/backoffice.model.ts
//para tener mejor ordenado la app
export interface ProductSection {
  id: number;
  name: string;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface BackofficeProduct {
// id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt?: Date;
  section?: ProductSection;
  category?: ProductCategory;
}



@Injectable({
  providedIn: 'root',
})
export class Product {

private apiUrl = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/products/search';



  
  private apiUrlOrders = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/payments';

  
  constructor(private http: HttpClient) { }//constructor


  
  
  // Método para buscar productos por término en el buscador principal 
  searchProducts(term: string | number): Observable<any[]> {
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
name: formData.name, 
    dni:formData.dni,
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


  private apiUrlFeaturedProducts= 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/destacados';
  
  getFeaturedProducts():Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrlFeaturedProducts);
    
  }

  //destacados por categoria
  getFeaturedProductsByCategory(categoryId: number): Observable<Product[]> {
  return this.http.get<Product[]>(`/api/products/featured-by-category/${categoryId}`);
  }

  //productos por categoría 

private apiUrlProductsByCategory = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/category';
  
  getProductsByCategory(category: string): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrlProductsByCategory}/${category}`);
}

  //para Mostrar la section ofertas 
  
    private apiUrlProductsEnOferta= 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/productsenoferta';
  
  getProductsenoferta():Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrlProductsEnOferta);
    
  }
  private apiUrlTodosLosProductos = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/todoslosproductos';
  // Trae todos los productos para el menú productos 
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrlTodosLosProductos);
  }



  
  

  //para seccion categoria se define una key propia
  //así después en el login  podemos usarla para redirigir al component 
  //categoria donde esta el checkout stepper de categoria

private pendingKey = 'pendingCheckout'; // clave única

  setPendingCheckout(type: 'allproducts' | 'allproductsearch' | 'featured' | 'category' | 'offers' , productId: number) {
  const data = { type, productId };
  localStorage.setItem(this.pendingKey, JSON.stringify(data));


    alert("pendingKey recibida en el servicio setPendingCheckout"+ JSON.stringify(data));
  }
  
  getPendingCheckout(): { type: string, productId:number } | null {
  const data = localStorage.getItem(this.pendingKey);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parseando pendingCheckout', e);
      return null;
    }
  }
  return null;
  }

  //categoria
setPendingCheckoutCategory(type: 'product' | 'featured' | 'category' | 'offers' , value: any) {
  const data = { type, value };
  localStorage.setItem(this.pendingKey, JSON.stringify(data));
   
}

  getPendingCheckoutCategory(): { type: string, value:any } | null {
  const data = localStorage.getItem(this.pendingKey);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parseando pendingCheckout', e);
      return null;
    }
  }
  return null;
  }
  
  // Limpiar el ID pendiente
  clearPendingCheckout() {
    alert('Borrando clave:'+ this.pendingKey);
    localStorage.removeItem(this.pendingKey);
  }

  private apiUrlSendPasswordReset = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/auth/forgot-password';
  sendPasswordReset(email: string): Observable<any> {
  
    // Usamos POST y enviamos el email en el body
    return this.http.post<any>(this.apiUrlSendPasswordReset, { email });
  }

resetPassword(token: string, newPassword: string): Observable<any> {
  return this.http.post<any>(
    'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/auth/reset-password',
    { token, newPassword }
  );
}

  private apiUrlSendUsernameReset = 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/auth/forgot-username';
  sendUsernameReset(email: string): Observable<any> {
   alert("llegó  el mail al username reset service"+email);
    // Usamos POST y enviamos el email en el body
    return this.http.post<any>(this.apiUrlSendUsernameReset, { email });
  }

  resetUsername(token: string, newUsername: string): Observable<any> {
  return this.http.post<any>(
    'https://portfoliowebbackendkoyeb-1-ulka.onrender.com/api/auth/reset-username',
    { token, newUsername }
  );
  }


  //para gestión de proyectos backoffice 

  private apiUrlBackOffice= 'https://portfoliowebbackendkoyeb-1-ulka.onrender.com';
  getAll(): Observable<BackofficeProduct[]> {
    return this.http.get<BackofficeProduct[]>(`${this.apiUrlBackOffice}/api/backoffice/get-all-products`);

  }

  create(product: BackofficeProduct): Observable<BackofficeProduct> {
    alert("datos del formulario Gestión "+JSON.stringify(product));
    return this.http.post<BackofficeProduct>(`${this.apiUrlBackOffice}/api/backoffice/create-product`, product);
  }

  update(id: number, product: BackofficeProduct): Observable<BackofficeProduct> {
    return this.http.put<BackofficeProduct>(`${this.apiUrlBackOffice}/api/backoffice/update-product/${id}`, product);
  }

  delete(id: number): Observable<void> {
    alert("id recibido en el método delete en el service"+id);
      return this.http.delete<void>(`${this.apiUrlBackOffice}/api/backoffice/delete-product/${id}`);
  }


//section desde backoffice 
  private apiUrlSections = '/api/sections';
  getSections(): Observable<ProductSection[]> {
    return this.http.get<ProductSection[]>(this.apiUrlSections);
  }

}
