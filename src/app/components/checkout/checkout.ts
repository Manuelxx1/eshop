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
    this.http.post('https://portfoliowebbackendkoyeb-1.onrender.com/api/payments/create', this.selectedProduct, { responseType: 'text' })
    .subscribe({
      next: (url: string) => {
        window.location.href = url; // redirige al sandbox de MercadoPago
      },
      error: err => console.error('Error al crear pago', err)
    });
  }
}
