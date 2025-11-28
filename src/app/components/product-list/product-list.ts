import { Component, OnInit } from '@angular/core';
/*
Como Order ya incluye dentro los items, 
y cada item incluye el product,
no hace falta importar User, 
Product ni OrderItem en el componente. 
Angular ya sabe la estructura 
porque está anidada dentro de Order

*/
import { Product,Order} from '../../services/product';
import { CommonModule } from '@angular/common';

import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { Cart} from '../../services/cart';
//se importa la interfaz CartItem que representa al modelo
import { CartItem } from '../../services/cart'; // ajustá el path si hace falta


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  //recibir datos del formulario buscador
  searchControl = new FormControl('');

  products: any[] = [];
  loading = true;
  error = false;
  orders: Order[] = [];
  items: CartItem[] = [];
total: number = 0;


  //para el dropdawn de compra directa 
  // Control reactivo para la cantidad
  quantityControl = new FormControl(1);
quantities: number[] = [1, 2, 3, 4, 5, 10]; // podés ajustar según el tipo de producto
  
  lastOrderId: number | null = null; // acá guardamos el ID dinámico
initPointUrl: string | null = null;
  errorredir: string | null = null;

  constructor(private productService: Product, private cartService: Cart,private router: Router ) {}

  
    ngOnInit(): void {
      
          this.searchControl.valueChanges.subscribe(term => {
      const query = term?.trim();
      if (query && query.length >= 2) {
        this.loading = true;
        this.productService.searchProducts(query).subscribe({
          next: data => {
            this.products = data;
            this.loading = false;
            this.error = false;
          },
          error: err => {
            console.error('Error al buscar productos', err);
            this.products = [];
            this.loading = false;
            this.error = true;
          }
        });
      } else {
        this.products = [];
      }
    });

    
    // Supongamos que ya obtuviste el orderId desde el backend
  // Si ya tenemos un pedido creado, lo consultamos
   /* if (this.lastOrderId) {
      this.productService.getOrder(this.lastOrderId).subscribe(data => {
        this.order = data;
      });
      }
      */
    this.productService.getOrders().subscribe(data => {
        this.orders = data;
      });
    }//ngOnInit 

//esto en realidad no es necesario aquí porque el carrito se muestra
  //en el component cart y este metodo loadCart ya esta alli 
  //y se muestra en la  vista cart html
  //se deveria ajustar el suscribe del método 
//addToCart a un console.log y nada más 
  //Asi se puede eliminar este metodo
  //sin se que produzca un error
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

  

  addToCart(product: any): void {
  this.cartService.addToCart(product.id, 1).subscribe({
    next: () => this.loadCart(),
    error: err => console.error('Error al agregar al carrito', err)
  });
}




// Compra directa → redirige al checkout
buyNow(productId: number): void {
  alert("Botón comprar clickeado ");
  const selectedQuantity = this.quantityControl.value ?? 1;
    console.log('Cantidad seleccionada:', selectedQuantity);

  this.productService.comprar(productId,selectedQuantity).subscribe({
    next: initPoint => {
      alert("initPoint recibido: " + initPoint);
      localStorage.setItem('selectedProduct', JSON.stringify(productId));

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


}


  






