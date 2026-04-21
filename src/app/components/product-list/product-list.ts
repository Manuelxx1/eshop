import { Component,HostListener,OnInit,OnDestroy,AfterViewInit} from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Cart} from '../../services/cart';
import { CheckoutStepper} from '../../components/checkout-stepper/checkout-stepper';
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
  imports: [CommonModule,ReactiveFormsModule,RouterLink,CheckoutStepper],
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
  destacadoporcategories: FormGroup;
  categories: string[] = [];
  productosenoferta:any[] = [];
countdown: string = '';
  
  
  loading = true;
  error = false;
  orders: Order[] = [];
  items: CartItem[] = [];
total: number = 0;

searchControl = new FormControl;

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


  constructor(private productService: Product, private cartService: Cart,private router: Router,private fb: FormBuilder,private route: ActivatedRoute) {




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


    this.destacadoporcategories = this.fb.group({
      category: ['']   // valor inicial vacío = todas las categorías
    });
    
  }// constructor 

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
  goToLogin(productId: number) {
  //localStorage.setItem('pendingCheckout', productId.toString());
  alert('Guardando pendingId:'+ productId);
    this.productService.setPendingCheckout(productId); // acá usás el setter
    this.router.navigate(['/login']);
  }
 
  
  //para el stepper guía al usuario 

selectedProduct: any;
  selectedProductId: number | null = null;
  showStepperModal = false;
  toastMessage: string | null = null;

  
  showToast(message: string) {
  this.toastMessage = message;

  }
  
/*para el carrito  
startCheckout(product: any) {
const valorId = localStorage.getItem('idUsuario');
  const idUsuario = valorId ? Number(valorId) : null; //  conversión a número
    if(idUsuario){
  this.selectedProduct = product;
  this.showStepperModal = true;   // abre el modal
    }else{
      this.showToast("Debes iniciar sesión para hacer la compra");
   // alert("Debes iniciar sesión para hacer la compra");
      this.showStepperModal = false; // asegurate de cerrarlo
      // esperar 5 segundos antes de redirigir
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
    }
    
}
*/

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
//para el mocking
    //this.featuredProducts = this.productService.getFeaturedProducts();
this.productService.getFeaturedProducts().subscribe(products => {
    this.featuredProducts = products; // acá sí es un array
  this.categories = [...new Set(products.map(p => p.category))];
  });

this.productService.getProductsenoferta().subscribe(products => {
    this.productosenoferta = products; // acá sí es un array
  
  });

    this.startCountdown(120); // duración en minutos

//luego de iniciar session desde el boton iniciar session para comprar 
    //llamamos al servicio donde le habíamos pasado el productId 
    //qye finalmente ke pasamos al metodo openStepperModal oara abrir
    //el modal stepper y poder comprar el producto que se habia seleccionado
    //cuando estábamos sin session
   // Revisar si había producto pendiente después del login
        this.productService.getFeaturedProducts().subscribe(data => {
    this.featuredProducts = data;
    alert('Productos cargados:'+this.featuredProducts);

    const pendingId = this.checkoutService.getPendingCheckout();
    alert('PendingId leído en ProductComponent:'+ pendingId);

    if (pendingId && this.isLoggedIn()) {
      const product = this.featuredProducts.find(p => p.id === pendingId);
      alert('Producto encontrado:' +product);

      if (product) {
        this.selectedProduct = product;
        this.showStepperModal = true;
        this.checkoutService.clearPendingCheckout();
      }
    }
  });
  }//ngOnInit 


startCountdown(durationMinutes: number) {
    const endTime = new Date().getTime() + durationMinutes * 60000;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(timer);
        this.countdown = 'Finalizado';
        return;
      }

      const hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
      const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
      const seconds = Math.floor((distance % (1000*60)) / 1000);

      this.countdown = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }
  
        // Getter para acceder al valor seleccionado de las categorías 
  get filteredProducts(): Product[] {
  const selectedCategory = this.destacadoporcategories.get('category')?.value;
  if (!selectedCategory) {
    return []; // no devolver todos, sino vacío 
    //para no duplicar la vista con el susbribe 
    //que llama a productosdestacados 
  }
  return this.featuredProducts.filter(p => p.category === selectedCategory);
}

    
//para el scroll a secciones desde lo que retorna el link productos en menu
          ngAfterViewInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });

            // 🔹 Efecto de resaltado en la sección
            element.classList.add('highlighted');
            setTimeout(() => {
              element.classList.remove('highlighted');
            }, 2000);

            // 🔹 Efecto de parpadeo en el título
            const title = element.querySelector('h2');
            if (title) {
              title.classList.add('blink-title');
              setTimeout(() => {
                title.classList.remove('blink-title');
              }, 3000);
            }
          }
        }, 0);
      }
    });
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


  






