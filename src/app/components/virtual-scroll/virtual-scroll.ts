import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

interface MockProduct {
  id: number;
  name: string;
  price: number;
}


@Component({
  selector: 'app-virtual-scroll',
  imports: [CommonModule, ScrollingModule],
  templateUrl: './virtual-scroll.html',
  styleUrl: './virtual-scroll.css',
})
export class VirtualScroll implements OnInit{
mockproducts: MockProduct[] = [];

ngOnInit() {
    this.mockproducts = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Producto ${i + 1}`,
      price: Math.floor(Math.random() * 1000)
    }));
}
  
}
