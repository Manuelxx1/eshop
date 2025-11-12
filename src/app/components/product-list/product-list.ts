import { Component, OnInit } from '@angular/core';
import { Product } from '../../services/product';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products: any[] = [];

  constructor(private productService: Product) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
      }

}
