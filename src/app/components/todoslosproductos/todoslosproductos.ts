import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product,Order} from './services/product';

@Component({
  selector: 'app-todoslosproductos',
  imports: [RouterOutlet,RouterModule, CommonModule,ReactiveFormsModule],
  templateUrl: './todoslosproductos.html',
  styleUrl: './todoslosproductos.css'
})
export class App {
  

  products: any[] = [];
  loading = true;
  error = false;
  

  
  constructor(private productService: Product ){}
  
      this.productService.searchProducts().subscribe({
        next: data => {
          this.products = data;
          this.loading = false;
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
  


  
}
