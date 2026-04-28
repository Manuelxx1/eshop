import { Component,OnInit } from '@angular/core';
import { Product,Order} from '../../services/product';
import { RouterModule } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CheckoutStepper} from '../../components/checkout-stepper/checkout-stepper';
import { Router } from '@angular/router';
import { Cart} from '../../services/cart';


@Component({
  selector: 'app-todoslosproductos',
  imports: [RouterModule, CommonModule,ReactiveFormsModule,CheckoutStepper],
  templateUrl: './todoslosproductos.html',
  styleUrl: './todoslosproductos.css'
})
export class Todoslosproductos implements OnInit {
  

  products: any[] = [];
  loading = true;
  error = false;
  
selectedProduct: any;
  showStepperModal = false;
  quantityControl = new FormControl<number>(1, { nonNullable: true });

  
  constructor(private productService: Product,private cartService: Cart,private router: Router){}

ngOnInit(): void {
    //this.loadProducts();
  this.productService.getAllProducts().subscribe({
  next: data => {
    this.products = data;
    this.loading = false;

    const pendingCheckout = this.productService.getPendingCheckout();
    alert('PendingId leído en ProductComponent:' + pendingCheckout?.productId);

    if (pendingCheckout && this.isLoggedIn()) {
      const product = this.products.find(p => p.id === pendingCheckout.productId);
      alert('Producto encontrado:' + product?.name);

      if (product) {
        this.selectedProduct = product;
        this.showStepperModal = true;
        localStorage.removeItem('pendingCheckout');
      }
    }
  },
  error: err => {
    console.error('Error al cargar productos', err);
    this.products = [];
    this.loading = false;
    this.error = true;
  }
});

}
  /*
      loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: data => {
        this.products = data;
        this.loading = false;

const pendingCheckout = this.productService.getPendingCheckout();
alert('PendingId leído en ProductComponent:'+ pendingCheckout?.productId);

        
if (pendingCheckout && this.isLoggedIn()) {
  const product = this.products.find(p => p.id === pendingCheckout.productId);
  alert('Producto encontrado:' + product?.name);
  
  

if (product) {
  this.selectedProduct = product;
  this.showStepperModal = true;
  

    //para que no quede en localStorage luego de finalizar la compra
       //esto evita que el stepper vuelva a aparecer sin que lo llamaramos
        //y nos permita otra vez buscar algún otro producto que deseamos comprar 
        
   localStorage.removeItem('pendingCheckout');


}
  }
        
  
        
      },
      error: err => {
        console.error('Error al cargar productos', err);
        this.products = [];
        this.loading = false;
        this.error = true;
      }
    
});
      }
        
  */

  //mostrar el boton compra directa que abre el modal stepper solo si hay session
  isLoggedIn(): boolean {
  const valorId = localStorage.getItem('idUsuario');
  return !!valorId; // true si hay sesión
  }

  goToLogin(type: 'allproducts' | 'featured' | 'category' | 'offers',productId: number ) {
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


  addToCart(product: any): void {
  const quantity = this.quantityControl.value; //  acá tomás el valor del select
  const idUsuario = Number(localStorage.getItem('idUsuario'));
if (idUsuario) {
    // Usuario logueado → carrito en backend 
    this.cartService.addToCart(product.id, quantity,idUsuario ).subscribe({
    next: (cart) =>{
      console.log("Carrito actualizado en backend:", cart);
      // No hace falta asignar nada manualmente si tu servicio ya hace tap() y actualiza itemsSubject
    // La vista se refresca sola porque el HTML usa cartService.items$ | async
    },
    error: err =>{
      console.error('Error al agregar al carrito', err);
    }
  });
      } else {
    // Usuario sin sesión → carrito local
  //en este caso se pasa el objeto product completo porque la interfaz   
  //CartItem lo requeria por esta definición private items: CartItem[] = [];
  //si definimos así private items: Any [] = []; no iba a ser necesario obedecer 
  //a las propiedades declaradas en la interfaz CartItem 
  //y se le podria pasar cualquier tipo de datos a nuestro método addItem
  //eso facilita el código pero en producción se usa la interfaz 
  //porque  te facilita mostrar nombre, precio, imagen, etc. en la página del carrito sin errores.
  this.cartService.addItem( product, quantity );
    console.log("Agregado al carrito local");
}
}



  
}
