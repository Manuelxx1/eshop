import { Component, signal } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WsTestComponent } from './components/ws-test-component/ws-test-component';
import { Product,Order} from './services/product';
import { Cart} from './services/cart';
//se importa la interfaz CartItem que representa al modelo
import { CartItem } from './services/cart'; // ajustá el path si hace falta


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule, CommonModule, WsTestComponent,ReactiveFormsModule,RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  //title se nuestra en el FrontEnd así {{title}}
  //protected readonly title = signal('eshop con WebSocket');
//recibir datos del formulario buscador
  searchControl = new FormControl('');
  menuOpen = false;

  products: any[] = [];
  loading = true;
  error = false;
  searchActive=false;
  //carrito sin session
cartCount = 0;
  // almacena los items agregados al carrito 
  items: any[] = [];
  //menu desplegable del carrito sin session
  dropdownOpen = false;

  //la property total no está acá porque usamos un async pipe
// con BehaviorSubject en el service para mostrar el Subtotal en la vista sin suscribirse 
 //importante: public a cartService para usarlo en el template con async pipe
  constructor(private productService: Product, public cartService: Cart ){}
  ngOnInit(): void {
  this.searchControl.valueChanges.subscribe(term => {
    const query = term?.trim();
    if (query && query.length >= 2) {
      this.loading = true;
      this.error = false;
      this.products = [];
      this.searchActive = true; // nueva bandera
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
      this.searchActive = false; // no hay búsqueda activa
    }
  });


    // Nos suscribimos al observable del carrito sin session
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
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

    
  }


}
