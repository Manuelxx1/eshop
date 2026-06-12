import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Product,BackofficeProduct,ProductSection,ProductCategory } from '../../services/product';
import { Validators } from '@angular/forms';










@Component({
  selector: 'app-backoffice-crud-products',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './backoffice-crud-products.html',
  styleUrl: './backoffice-crud-products.css',
})
export class BackofficeCrudProducts implements OnInit {
  products: BackofficeProduct[] = [];
  form: FormGroup;
//solo números 
  //sections: number[] = [];
 // categories:number[] = [];
//solo nombres
  //sections: string[] = [];
// categories:string[] = [];
 //si quiero los dos definimos un objeto 
  sections: ProductSection[] = [];
  categories:ProductCategory[] = [];

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
  name: ['', Validators.required],
  price: [ , [Validators.required, Validators.min(1)]],
  stock: [ , [Validators.required, Validators.min(0)]],
  description: ['', Validators.required],
  imageUrl: ['', Validators.required],
  section: [null, Validators.required],  //número null hasta que llegue el dato del form
  category: [null, Validators.required]  //número null hasta que llegue el dato del form
});
  }

  ngOnInit(): void {
    this.loadProducts();


  }

  loadProducts() {
    this.productService.getAll().subscribe(data =>{
      this.products = data
  // this.sections = [...new Set(data.map(p => p.category.name))];
  /*
  en el caso de solo querer los nombres de las categorías 
this.categories = Array.from(new Set(data
      .filter(p => p.category && p.category.name )  // filtrás nulos
      .map(p => p.category!.name  )
  ))as string[];

en el caso de querer solo los números de las sections
 
  this.sections = Array.from(new Set(data
      .filter(p => p.section && p.section.id) // filtrás nulos
      .map(p => p.section!.id)
  )) as number[];
    */

//si quiero todos los valores definir un objeto 
      this.sections = Array.from(new Map(data
      .filter(p => p.section && p.section.id && p.section.name)
      .map(p => [p.section!.id, p.section!]) // clave = id, valor = objeto
  ).values()
);

      
      
      this.categories = Array.from(new Map(data
      .filter(p => p.category && p.category.id && p.category.name)
      .map(p => [p.category!.id, p.category!]) // clave = id, valor = objeto
  ).values()
);

      
    });
  }

  addProduct() {

    if (this.form.invalid) {
    // Marca todos los controles como tocados para mostrar errores
    this.form.markAllAsTouched();
    return;
    }
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
    section: { id: formValue.section },
  category: { id: formValue.category  }
  };
    
    this.productService.create(product).subscribe(() => {
      this.loadProducts();
      this.form.reset();
    });
  }


updateProduct() {

    if (this.form.invalid) {
    // Marca todos los controles como tocados para mostrar errores
    this.form.markAllAsTouched();
    return;
    }
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
    section: { id: formValue.section },
  category: { id: formValue.category  }
  };
    
    this.productService.update(88,product).subscribe(() => {
      this.loadProducts();
      this.form.reset();
    });
}

  
  deleteProduct(id: number) {
    this.productService.delete(id).subscribe(() => this.loadProducts());
  }

}
