
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Product,Order} from '../../services/product';


@Component({
  selector: 'app-filters',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters implements OnChanges{
@Input() products: Product[] = [];
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

  ngOnChanges() {
    if (this.products.length > 0) {
      this.categories = [...new Set(this.products.map(p => p.category))];
      this.applyFilters();
    }
  }

  applyFilters() {
    const { category, minPrice, maxPrice, sortOption } = this.form.value;
    let result = [...this.products];

    if (category) {
      result = result.filter(p => p.category === category);
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
