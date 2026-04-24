import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe,CurrencyPipe} from '@angular/common';
import { Product} from '../../services/product';
import { CommonModule } from '@angular/common';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { Cart} from '../../services/cart';
import { CheckoutStepper} from '../../components/checkout-stepper/checkout-stepper';

@Component({
  selector: 'app-categoria',
  imports: [TitleCasePipe,CommonModule,CurrencyPipe,ReactiveFormsModule,CheckoutStepper],
  templateUrl: './categoria.html',
  styleUrls: ['./categoria.css']
})
export class Categoria implements OnInit {
  categoriaNombre: string = '';
    //productos por categoría 
  productosporcategoria: any[] = [];
  quantityControl = new FormControl<number>(1, { nonNullable: true });
  
  constructor(private route: ActivatedRoute,private productService: Product,private cartService: Cart,private router: Router) {}

  ngOnInit() {
    this.categoriaNombre = this.route.snapshot.paramMap.get('nombre') || '';
  /* para el mocking de categoría 
    this.productosporcategoria = this.productService.getProductsByCategory(this.categoriaNombre);
 */

    this.productService.getProductsByCategory(this.categoriaNombre).subscribe(products => {
    this.productosporcategoria = products;

      alert('Productos cargados:'+this.productosporcategoria);
    });


   const pendingData = this.productService.getPendingCheckout();

if (pendingData && this.isLoggedIn()) {
  if (pendingData.type === 'product') {
    const product = this.productosporcategoria.find(p => p.id === pendingData.value.id);
    if (product) {
      this.selectedProduct = product;
      this.showStepperModal = true;
      this.productService.clearPendingCheckout();
    }
  }
}
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
  //mostrar el boton compra directa que abre el modal stepper solo si hay session
  isLoggedIn(): boolean {
  const valorId = localStorage.getItem('idUsuario');
  return !!valorId; // true si hay sesión
}

  // Caso 2: usuario no logueado
//el boton iniciar sesión para comprar Llama a este metodo 
  //guardando el id del producto para que luego de iniciar session
  //se tome el producto que se había seleccionado para evitar 
  //qye el usuario vuelva abuscar asi el flujo queda optimizado
  //listo para hacer la compra
  goToLogin(type: 'product' | 'featured' | 'category' | 'offers',value: any) {
  this.productService.setPendingCheckout(type, value);
  this.router.navigate(['/login']);
}

 
  
  //para el stepper guía al usuario 

selectedProduct: any;
  selectedProductId: number | null = null;
  showStepperModal = false;


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
