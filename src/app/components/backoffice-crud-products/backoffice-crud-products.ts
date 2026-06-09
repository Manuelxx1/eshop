import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../../services/product';


export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Categories;
  section: Section; //  objeto Section completo
  imageUrl: string;
  createdAt: string;
}

@Component({
  selector: 'app-backoffice-crud-products',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './backoffice-crud-products.html',
  styleUrl: './backoffice-crud-products.css',
})
export class BackofficeCrudProducts implements OnInit {
  products: Product[] = [];
  form: FormGroup;


  constructor(private productService: Product, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      price: [0],
      stock: [0]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe(data => this.products = data);
  }

  addProduct() {
    this.productService.create(this.form.value).subscribe(() => {
      this.loadProducts();
      this.form.reset();
    });
  }

  deleteProduct(id: number) {
    this.productService.delete(id).subscribe(() => this.loadProducts());
  }

}
