import { Component, OnInit } from '@angular/core';
import { Product } from '../../services/product;

@Component({
  selector: 'app-ws-test-component',
  imports: [],
  templateUrl: './ws-test-component.html',
  styleUrl: './ws-test-component.css',
})
export class WsTestComponent implements OnInit {
  conexionActiva = false; 
  notifications: string[] = [];
  constructor(private productService: Product) {}
  ngOnInit(): void { 
    this.productService.stompClient.onConnect = () => { 
      this.conexionActiva = true; 
      this.productService.stompClient.subscribe('/topic/notificaciones', (message) => { 
        this.notifications.push(message.body); 
      }); 
    };
    this.productService.stompClient.activate();
  } 
  sendTestNotification(): void { 
    this.productService.sendNotification('Hola desde Angular 🚀');
  }

  
}
