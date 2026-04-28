import { Component,OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product,Order} from '../../services/product';

@Component({
  selector: 'app-todoslosproductos',
  imports: [RouterModule, CommonModule,ReactiveFormsModule],
  templateUrl: './todoslosproductos.html',
  styleUrl: './todoslosproductos.css'
})
export class Todoslosproductos implements OnInit {
  

  products: any[] = [];
  loading = true;
  error = false;
  
selectedProduct: any;
  showStepperModal = false;
  
  constructor(private productService: Product ){}

ngOnInit(): void {
    this.loadProducts();
}
  
      loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar productos', err);
        this.products = [];
        this.loading = false;
        this.error = true;
      }
    });

        const pendingCheckout = this.productService.getPendingCheckout();
alert('PendingId leído en ProductComponent:'+ pendingCheckout?.productId);

if (pendingCheckout && this.isLoggedIn()) {
  const product = this.products.find(p => p.id === pendingCheckout.productId);
  alert('Producto encontrado:' + product?.name);
  
  

if (product) {
  this.selectedProduct = selected;
  this.showStepperModal = true;
  

    //para que no quede en localStorage luego de finalizar la compra
       //esto evita que el stepper vuelva a aparecer sin que lo llamaramos
        //y nos permita otra vez buscar algún otro producto que deseamos comprar 
        
    localStorage.removeItem('pendingCheckout');
}
  }
      }

  //mostrar el boton compra directa que abre el modal stepper solo si hay session
  isLoggedIn(): boolean {
  const valorId = localStorage.getItem('idUsuario');
  return !!valorId; // true si hay sesión
  }

  goToLogin(type: 'product' | 'featured' | 'category' | 'offers',productId: number ) {
  this.productService.setPendingCheckout(type, productId);
  this.router.navigate(['/login']);
  }

  
  
// Caso 1: usuario ya logueado
  startCheckout(product: any) {
const valorId = localStorage.getItem('idUsuario');
  const idUsuario = valorId ? Number(valorId) : null; //  conversión a número
    if(idUsuario){
  this.selectedProduct = product;
  this.showStepperModal = true;   
    }
  }

  closeStepper() {
  this.showStepperModal = false;    // cierra el modal
  this.selectedProduct = null; // limpia selección si querés
 // limpiar la clave recién al cerrar el modal
  this.productService.clearPendingCheckout();
  alert('Clave borrada al cerrar modal');
  }

  
}
