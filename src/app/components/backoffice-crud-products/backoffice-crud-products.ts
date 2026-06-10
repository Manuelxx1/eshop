import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../../services/product';

export interface Section {
  id: number;
  name: string;
}

export interface Categories {
  id: number;
  name: string;
}

export interface Products {
  id?: number;   // opcional, lo genera la base
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Categories;
  section: Section; //  objeto Section completo
  imageUrl: string;
  createdAt?: Date;   //string o Date
}




@Component({
  selector: 'app-backoffice-crud-products',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './backoffice-crud-products.html',
  styleUrl: './backoffice-crud-products.css',
})
export class BackofficeCrudProducts implements OnInit {
  products: Products[] = [];
  form: FormGroup;


  constructor(private productService: Product, private fb: FormBuilder) {
   /*
no conviene definir section:[{id:''}] directamente en el FormGroup.
Angular Reactive Forms espera valores simples (string, number, boolean) en los controles.
Si ponés un objeto ahí, el form.value va a terminar con algo como:

json
{
  "section": { "id": "" },
  "category": { "id": "" }
}
El problema es que cuando el usuario escribe un número en el input,
Angular lo pisa y queda "section": 2 en vez de { "id": 2 }. 
Por eso no se inserta bien en la base.
por eso hay que convertirlo a un objeto en el método 
addProduct() antes de enviar al backend
   */
    
    this.form = this.fb.group({
      name: [''],
      price: [],
      stock: [],
      description:[''],
      imageUrl:[''],
      section:[null],//número null hasta que llegue el dato del form
     category:[null]  //número null  hasta que llegue el dato del form         
                              
                              
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe(data => this.products = data);
  }

  addProduct() {
//se obtienen los datosdel form
    const formValue = this.form.value;
//convertimos nuestros datos del reactive forms
   //como un objeto json para que hibernate en el backend 
    //los pueda mapear correctamente para insertar en la base
     
    //asignamos valores a las property 
    //y a lo que son objetos anidados como section y category 
    //se les asigna sus campos correspondientes 
    //con los valores obtenidos del formvalue     
    const product = {
    name: formValue.name,
    price: formValue.price,
    stock: formValue.stock,
    description: formValue.description,
    imageUrl: formValue.imageUrl,
    section: formValue.section ? { id: formValue.section } : null,
    category: formValue.category ? { id: formValue.category } : null
  };
    
    this.productService.create(product).subscribe(() => {
      this.loadProducts();
      this.form.reset();
    });
  }

  deleteProduct(id: number) {
    this.productService.delete(id).subscribe(() => this.loadProducts());
  }

}
