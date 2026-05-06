import { Component, signal } from '@angular/core';
import { RouterOutlet,RouterLink,Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WsTestComponent } from './components/ws-test-component/ws-test-component';
import { Product,Order} from './services/product';
import { Cart} from './services/cart';
import { CheckoutStepper} from './components/checkout-stepper/checkout-stepper';
import {Filters} from './components/filters/filters';
//se importa la interfaz CartItem que representa al modelo
import { CartItem } from './services/cart'; // ajustá el path si hace falta


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule, CommonModule, WsTestComponent,ReactiveFormsModule,RouterLink,CheckoutStepper,Filters],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  //title se nuestra en el FrontEnd así {{title}}
  //protected readonly title = signal('eshop con WebSocket');
//recibir datos del formulario buscador
  searchControl = new FormControl('');
  quantityControl = new FormControl<number>(1, { nonNullable: true });
  menuOpen = false;

  products: any[] = [];
  loading = false;
  error = false;
  searchActive=false;
  //carrito sin session
cartCount = 0;
  animate = false;
  animateRemove = false;
  // almacena los items agregados al carrito 
  items: any[] = [];
  //menu desplegable del carrito sin session
  dropdownOpen = false;
  selectedProduct: any;
  showStepperModal = false;
highlightedProductId: number | null = null;


filteredProducts: Product[] = [];  // resultado de filtros


  //la property total no está acá porque usamos un async pipe
// con BehaviorSubject en el service para mostrar el Subtotal en la vista sin suscribirse 
 //importante: public a cartService para usarlo en el template con async pipe
  constructor(private productService: Product, public cartService: Cart, private router: Router){}
ngOnInit(): void {
  // 1. Revisar si hay un checkout pendiente al entrar
  const pendingCheckout = this.productService.getPendingCheckout();
  if (pendingCheckout && this.isLoggedIn()) {
    this.loading = true;
    this.productService.searchProducts(pendingCheckout.productId).subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
        const product = this.products.find(p => p.id === pendingCheckout.productId);
        if (product) {
          this.selectedProduct = product;
          this.showStepperModal = true;
          localStorage.removeItem('pendingCheckout');
        }
      },
      error: err => {
        console.error('Error al buscar producto pendiente', err);
        this.products = [];
        this.loading = false;
        this.error = true;
      }
    });
  }

  // 2. Mantener la lógica normal del buscador
  this.searchControl.valueChanges.subscribe(term => {
    const query = term?.trim();
    if (query && query.length >= 2) {
      this.loading = true;
      this.error = false;
      this.products = [];
      this.searchActive = true;

      this.productService.searchProducts(query).subscribe({
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
      this.searchActive = false;
    }
  });


/*
          this.productService.getAllProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data; // al inicio mostramos todos
    });
                  
*/

    // Nos suscribimos al observable del carrito sin session
    ///usando BehaviorSubject sin el pipe async
    //subscribiendonos desdecaqui
    this.cartService.cartCount$.subscribe(count => {
  const previousCount = this.cartCount;

  if (count !== previousCount) {
    this.cartCount = count;

    if (count < previousCount) {
      // eliminación
      this.animateRemove = true;
      setTimeout(() => this.animateRemove = false, 600);
    } else {
      // agregado
      this.animate = true;
      setTimeout(() => this.animate = false, 600);
    }
  }
});


    this.items = this.cartService.getItemsSinSession();
  
}//ngOnInit 

  //para Mostrar el menú en movil
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

//ocultar el nav-menu con sus elementos 
  closeMenu() {
  this.menuOpen = false;
  }


  //desplegable para mostrar los items del carrito sin session 
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    // refrescamos los items cada vez que se abre
    if (this.dropdownOpen) {
      this.items = this.cartService.getItemsSinSession();
    }
  }

    //pata eliminar items del carrito sin session 
  removeItem(index: number) {
    this.cartService.removeItem(index);
    this.items = this.cartService.getItemsSinSession(); // refrescamos lista
  }

  
    clearCartSinSession() {
  this.cartService.clearCartSinSession();
  this.items = this.cartService.getItemsSinSession(); // refrescar vista
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
  //método antiguo sin el switch en el login
  /*goToLogin(productId: number) {
  //localStorage.setItem('pendingCheckout', productId.toString());
  alert('Guardando pendingId:'+ productId);
    this.productService.setPendingCheckout(productId); // acá usás el setter
    this.router.navigate(['/login']);
  }
 */

  goToLogin(type: 'allproducts' | 'allproductsearch' | 'featured' | 'category' | 'offers',productId: number ) {
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

  //método al que se llama para intentar  
  //a que se muestre el modal con el producto 
  //si hubo un error de conexion de red
  retryPendingCheckout(): void {
  const pendingCheckout = this.productService.getPendingCheckout();
  if (pendingCheckout && this.isLoggedIn()) {
    this.loading = true;
    this.error = false;
    this.productService.searchProducts(pendingCheckout.productId).subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
        const product = this.products.find(p => p.id === pendingCheckout.productId);
        if (product) {
          this.selectedProduct = product;
          this.showStepperModal = true;
          localStorage.removeItem('pendingCheckout');
        }
      },
      error: err => {
        console.error('Error al reintentar cargar producto', err);
        this.products = [];
        this.loading = false;
        this.error = true;
      }
    });
  }
}

  

openProductDetail(product: any): void {
  this.selectedProduct = product;
}

closeModal(event: MouseEvent): void {
  // Si el clic fue en el fondo (modal), cerramos
  this.selectedProduct = null;
}

markSelected(product: any): void {
  this.highlightedProductId = product.id;
  this.selectedProduct = null; // cerrar modal
  }

  
onFiltered(result: Product[]) {
  this.filteredProducts = result;
}
    
}



