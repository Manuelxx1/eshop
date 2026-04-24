import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe,CurrencyPipe} from '@angular/common';
import { Product} from '../../services/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria',
  imports: [TitleCasePipe,CommonModule,CurrencyPipe],
  templateUrl: './categoria.html',
  styleUrls: ['./categoria.css']
})
export class Categoria implements OnInit {
  categoriaNombre: string = '';
    //productos por categoría 
  productosporcategoria: any[] = [];

  constructor(private route: ActivatedRoute,private productService: Product) {}

  ngOnInit() {
    this.categoriaNombre = this.route.snapshot.paramMap.get('nombre') || '';
  /* para el mocking de categoría 
    this.productosporcategoria = this.productService.getProductsByCategory(this.categoriaNombre);
 */

    this.productService.getProductsByCategory(this.categoriaNombre).subscribe(products => {
    this.productosporcategoria = products;
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
  //mostrar el boton compra directa que abre el modal stepper solo si hay session
  isLoggedIn(): boolean {
  const valorId = localStorage.getItem('idUsuario');
  return !!valorId; // true si hay sesión
}

}
