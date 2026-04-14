import { Component, signal } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WsTestComponent } from './components/ws-test-component/ws-test-component';
import { Product,Order} from './services/product';
import { Cart} from './services/cart';
//se importa la interfaz CartItem que representa al modelo
//import { CartItem } from './services/cart'; // ajustá el path si hace falta


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
  
  constructor(private productService: Product, private cartService: Cart ){}
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
  
}//ngOnInit 

  //para Mostrar el menú en movil
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

//ocultar el nav-menu con sus elementos 
  closeMenu() {
  this.menuOpen = false;
  }

}
