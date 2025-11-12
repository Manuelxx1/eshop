import { Component, OnInit } from '@angular/core';
import { Product } from '../../services/product';
import { CommonModule } from '@angular/common';
import { Cart} from '../../services/cart';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products: any[] = [];
  loading = true;
  error = false;

  constructor(private productService: Product, private cartService: Cart) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar productos', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}

