import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})


  
export class Checkout implements OnInit {
  selectedProduct: any;
  total: number = 0;

  ngOnInit(): void {
    const stored = localStorage.getItem('selectedProduct');
    if (stored) {
      this.selectedProduct = JSON.parse(stored);
      this.total = this.selectedProduct.price;
    }
  }

  finalizePurchase(): void {
    alert('¡Compra realizada con éxito!');
    localStorage.removeItem('selectedProduct');
  }
}
