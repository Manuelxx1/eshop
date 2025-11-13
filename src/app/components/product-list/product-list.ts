import { Component, OnInit } from '@angular/core';
import { Product } from '../../services/product';
import { CommonModule } from '@angular/common';

import { FormControl, ReactiveFormsModule } from '@angular/forms';


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

  constructor(private productService: Product, private cartService: Cart) {}

  
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
  }

  addToCart(product: any) {
  this.cartService.addToCart(product);
}

}


  





