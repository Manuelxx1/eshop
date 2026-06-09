import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../../services/product';


@Component({
  selector: 'app-backoffice-crud-products',
  imports: [],
  templateUrl: './backoffice-crud-products.html',
  styleUrl: './backoffice-crud-products.css',
})
export class BackofficeCrudProducts {
  products: Product[] = [];
  form: FormGroup;


  constructor(private productService: ProductService, private fb: FormBuilder) {
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
