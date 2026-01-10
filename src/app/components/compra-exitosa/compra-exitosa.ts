import { Component,OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product,Order} from '../../services/product';

@Component({
  selector: 'app-compra-exitosa',
  imports: [CommonModule],
  templateUrl: './compra-exitosa.html',
  styleUrl: './compra-exitosa.css',
})
export class CompraExitosa implements OnInit {
  status: string | null = null; 
  paymentId: string | null = null;
  externalReference: string | null = null; 
orderDetails: Order | null = null;
  
  constructor(private route: ActivatedRoute,private productService: Product) {} 
 
  ngOnInit(): void { 
    this.route.queryParamMap.subscribe(params => { 
      this.status = params.get('status');
      this.paymentId = params.get('payment_id'); 
      this.externalReference = params.get('external_reference'); 
  
    
    if (this.externalReference) { 
      this.productService.getOrderCompraExitosa(this.externalReference).subscribe(order => { 
        this.orderDetails = order;
      }); 
    }//if
    }); //params 
 
  }
}


