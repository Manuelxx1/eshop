import { Component,HostListener,OnInit,OnDestroy } from '@angular/core';
//import { WsTestComponent } from '../ws-test-component/ws-test-component';

/*
Como Order ya incluye dentro los items, 
y cada item incluye el product,
no hace falta importar User, 
Product ni OrderItem en el componente. 
Angular ya sabe la estructura 
porque está anidada dentro de Order

*/
import { Product,Order} from '../../services/product';
import { CommonModule } from '@angular/common';
import { RouterOutlet,RouterLink } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { Cart} from '../../services/cart';
//se importa la interfaz CartItem que representa al modelo
import { CartItem } from '../../services/cart'; // ajustá el path si hace falta



interface Actividad {
  id?: string;              // opcional, sirve para evitar duplicados
  fecha: Date | string;     // puede venir como Date o string del backend
  tipo: string;
  descripcion: string;
}



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})


  


export class ProductList  {
  //recibir datos del formulario buscador
  //searchControl = new FormControl('');
 // menuOpen = false;


 products: any[] = [];
  //productos destacados 
  featuredProducts: any[] = [];

  loading = true;
  error = false;
  orders: Order[] = [];
  items: CartItem[] = [];
total: number = 0;



  datosDebug: string = '';
  email:string = '';  
  fechaderegistro:any;
  nombre:string ='';
  //para el dropdawn de compra directa 
  // Control reactivo para la cantidad
  //formato con declaración de tipado 
  //se me asigna el valor por defecto 1
  //y se define no nulo para que no surga error
  quantityControl = new FormControl<number>(1, { nonNullable: true });

quantities: number[] = [1, 2, 3, 4, 5, 10]; // podés ajustar según el tipo de producto


  showSummary = false; //  flag para mostrar resumen
  
  lastOrderId: number | null = null; // acá guardamos el ID dinámico
initPointUrl: string | null = null;
  errorredir: string | null = null;




  




  checkoutForm: FormGroup;
  //opciones de envío
  shippingOptions = [
  { id: 'standard', name: 'Envío estándar (3-5 días)', price: 5.99 },
  { id: 'express', name: 'Envío exprés (1-2 días)', price: 12.99 },
  { id: 'pickup', name: 'Retiro en tienda', price: 0.0 }
];

// Control reactivo para la opción seleccionada 
  //shippingControl = new FormControl(this.shippingOptions[0]);


  constructor(private productService: Product, private cartService: Cart,private router: Router,private fb: FormBuilder ) {
//formulario login
    this.formulariologin = this.fb.group({
    username: ['', Validators.required],
      password: ['', Validators.required]
    //email: ['', [Validators.required, Validators.email]]
  });




    //obtener datos personales para envío 
this.checkoutForm = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: [''],
  address: ['', Validators.required],
  city: ['', Validators.required],
  postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]],
  shippingOption: [null, Validators.required]   //  arranca en null
});


    
    
  }// constructor 


  //para el stepper guía al usuario 
currentStep = 1;
selectedProduct: any;

selectProduct(product: any) {
  this.selectedProduct = product;
  this.currentStep = 2;
}


  
  goNext() {
  this.currentStep++;
}



goBack() {
  if (this.currentStep > 1) {
    this.currentStep--;
    // Si vuelve al primer paso,para cambiar de producto reseteamos el envío
    //para qye el usuario pueda elegir la opcion que le conviene
    if (this.currentStep === 1) {
      this.checkoutForm.get('shippingOption')?.reset(null);
    }
  }
}


  
  
  ngOnInit(): void {
      
          this.searchControl.valueChanges.subscribe(term => {
      const query = term?.trim();
      if (query && query.length >= 2) {
        this.loading = true;
        this.productService.searchProducts(query).subscribe({
          next: data => {
            this.products = data;
            this.loading = false;
            this.error = false;
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
    });

    this.featuredProducts = this.productService.getFeaturedProducts();

    }//ngOnInit 
    

  


      







  
  


      





  
  




  
  
  addToCart(product: any): void {
  const quantity = this.quantityControl.value; //  acá tomás el valor del select
  const idUsuario = Number(localStorage.getItem('idUsuario'));

    this.cartService.addToCart(product.id, quantity,idUsuario ).subscribe({
    next: (res) =>{
      console.log("Error backend:", res);
    },
    error: err =>{
      console.error('Error al agregar al carrito', err);
    }
  });
}


//mostrar resumen de compra antes de confirmar compra 
mostrarResumen(): void {
    this.showSummary = true;
}



  
// Compra directa → redirige al checkout
buyNow(productId: number): void {
  alert("Botón comprar clickeado ");
  alert("productId del frontend" + productId);
  const selectedQuantity = this.quantityControl.value ?? 1;
  console.log('Cantidad seleccionada:', selectedQuantity);
//const shippingOption = this.shippingControl.value;
  const formData = this.checkoutForm.value;
  console.log('Datos del comprador:', formData);
  // recuperar usuario de la sesión (guardado en login)
  const valorId = localStorage.getItem('idUsuario');
  const idUsuario = valorId ? Number(valorId) : null; //  conversión a número
alert("Usuario del login" +idUsuario);
  this.productService.comprar(productId, selectedQuantity, idUsuario,formData).subscribe({
    next: initPoint => {
      alert("initPoint recibido: " + initPoint);
      localStorage.setItem('selectedProduct', JSON.stringify(productId));

      // redirige al checkout de Mercado Pago
      window.location.href = initPoint;
    },
    error: err => {
      alert("Error al llamar al backend: " + JSON.stringify(err));
      this.errorredir = JSON.stringify(err);
    }
  });
}



}


  






