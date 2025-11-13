import { Component } from '@angular/core';



@Component({
  selector: 'app-checkout',
  imports: [],
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
