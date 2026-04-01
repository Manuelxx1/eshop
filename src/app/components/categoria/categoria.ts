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
  this.productosporcategoria = this.productService.getProductsByCategory(this.categoriaNombre);
  }

  //este método es solo de ejemplo
  //colocar aqui el que esta en product-list.ts
  addToCart(product: any) {
    console.log('Producto agregado al carrito:', product);
  }
}
