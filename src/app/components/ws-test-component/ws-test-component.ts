import { Component, OnInit } from '@angular/core';
import { Parawebsocket } from '../../services/parawebsocket';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ws-test-component',
  imports: [CommonModule],
  templateUrl: './ws-test-component.html',
  styleUrl: './ws-test-component.css',
})
export class WsTestComponent  implements OnInit  {
  conexionActiva = false; 
  notifications: string[] = [];
 
  
  errorMsg = '';
  
  constructor(private parawebsocket: Parawebsocket) {}
  ngOnInit(): void {
    this.parawebsocket.stompClient.onConnect = () => { 
      this.conexionActiva = true;
      this.parawebsocket.stompClient.subscribe('/topic/notificaciones', (message) => {
        this.notifications.push(message.body);
      }); 
    };
    this.parawebsocket.stompClient.onStompError = (frame) => {
      this.errorMsg = 'Error STOMP: ' + frame.headers['message']; 
    };
    try {
      this.parawebsocket.stompClient.activate();
    } catch (e: any) { 
      this.errorMsg = 'Error al activar STOMP: ' + e.message;
    }
  }
  sendTestNotification(): void {
    this.parawebsocket.sendNotification('Hola desde Angular 🚀');
  }

}
