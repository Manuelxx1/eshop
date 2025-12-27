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
  constructor(private parawebsocket: Parawebsocket) {}
  ngOnInit(): void {
    this.parawebsocket.stompClient.onConnect = () => { 
      this.conexionActiva = true;
      this.parawebsocket.stompClient.subscribe('/topic/notificaciones', (message) => {
        this.notifications.push(message.body);
      }); 
    };
    this.parawebsocket.stompClient.onStompError = (frame) => {
      console.error('Broker error: ', frame.headers['message'], frame.body);
    };
    try { 
      this.parawebsocket.stompClient.activate();
    } catch (e) {
      console.error('Error al activar STOMP', e);
    } 
  } 
  sendTestNotification(): void {
    this.parawebsocket.sendNotification('Hola desde Angular 🚀');
  }

}
