import { Component, signal } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WsTestComponent } from './components/ws-test-component/ws-test-component';
import { Product,Order} from './services/product';
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

  
  constructor(private productService: Product ){}
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
}//ngOnInit 

  //para Mostrar el menú en movil
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

}
