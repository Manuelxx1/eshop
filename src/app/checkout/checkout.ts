import { Component } from '@angular/core';



@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})


  selectedProduct: any;
total: number = 0;
export class Checkout implements OnInit {

  ngOnInit(): void {
  const stored = localStorage.getItem('selectedProduct');
  if (stored) {
    this.selectedProduct = JSON.parse(stored);
    this.total = this.selectedProduct.price;
  }

}
