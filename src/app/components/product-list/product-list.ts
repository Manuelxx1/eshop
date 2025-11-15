import { Component, OnInit } from '@angular/core';
import { Product,Order} from '../../services/product';
import { CommonModule } from '@angular/common';

import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { Cart} from '../../services/cart';


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
  order: Order | null = null;
  
  lastOrderId: number | null = null; // acá guardamos el ID dinámico
initPointUrl: string | null = null;

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
    if (this.lastOrderId) {
      this.productService.getOrder(this.lastOrderId).subscribe(data => {
        this.order = data;
      });
      }
    
    }


  

  

  addToCart(product: any): void {
  console.log('Agregando al carrito:', product);
  this.cartService.addToCart(product);
}

// ✅ Compra directa → redirige al checkout
buyNow(product: any): void {
  alert("Botón comprar clickeado: " + product.name);

  this.productService.comprar(product).subscribe(initPoint => {
    alert("initPoint recibido: " + initPoint); // 👀 popup en Android
    localStorage.setItem('selectedProduct', JSON.stringify(product));

    // ✅ redirige al checkout de Mercado Pago
    window.location.href = initPoint;
  });
}

}


  






