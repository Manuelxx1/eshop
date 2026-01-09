import { Component,OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-compra-exitosa',
  imports: [],
  templateUrl: './compra-exitosa.html',
  styleUrl: './compra-exitosa.css',
})
export class CompraExitosa implements OnInit {
  status: string | null = null; 
  paymentId: string | null = null;
  externalReference: string | null = null; 
  constructor(private route: ActivatedRoute) {} 
 
  ngOnInit(): void { 
    this.route.queryParamMap.subscribe(params => { 
      this.status = params.get('status');
      this.paymentId = params.get('payment_id'); 
      this.externalReference = params.get('external_reference'); 
    }); 
  }
}


