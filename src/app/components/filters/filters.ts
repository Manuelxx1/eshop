
import { Component, Input, Output, EventEmitter, OnChanges,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Product,Order} from '../../services/product';


@Component({
  selector: 'app-filters',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters implements OnInit {
@Input() products: Product[] = [];
  @Input() productscategories: string[] = [];   // ahora viene del padre
  @Output() filtered = new EventEmitter<Product[]>();

  form: FormGroup;
  categories: string[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      category: [''],
      minPrice: [0],
      maxPrice: [500000],
      sortOption: ['']
    });

    this.form.valueChanges.subscribe(() => this.applyFilters());
  }

ngOnInit() {
  alert('Categorías recibidas en hijo:'+ this.productscategories);
}



  /*
  si no se define las categorías en el padre 
se define acá en ngOnChanges,entonces las categorías aparecen en el select
y luego se llama alfiltro 
applyFilters()
ngOnChanges() {
    if (this.products.length > 0) {
      this.categories = [...new Set(this.products.map(p => p.category.name))];

      this.applyFilters();
    }
  }
  */

  applyFilters() {
    const { category, minPrice, maxPrice, sortOption } = this.form.value;
    let result = [...this.products];

    if (category) {
      result = result.filter(p => p.category?.name === category);
    }

    result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);

    switch (sortOption) {
      case 'priceAsc': result.sort((a, b) => a.price - b.price); break;
      case 'priceDesc': result.sort((a, b) => b.price - a.price); break;
      case 'stock': result.sort((a, b) => b.stock - a.stock); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    this.filtered.emit(result);
                                                         }
}
