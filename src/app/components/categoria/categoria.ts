import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { Product} from '../../services/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria',
  imports: [TitleCasePipe,CommonModule],
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
}
