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
  errorMsg = '';
  constructor(private parawebsocket: Parawebsocket) {}
  ngOnInit(): void { 
    this.parawebsocket.stompClient.onConnect = () => {
      this.conexionActiva = true;
    };
    this.parawebsocket.stompClient.onStompError = (frame) => {
      this.errorMsg = 'Error STOMP: ' + frame.headers['message'] + ' ' + frame.body;
    }; 
    this.parawebsocket.stompClient.onWebSocketError = (event) => { 
      this.errorMsg = 'Error WebSocket: ' + event;
    }; 
    try {
      this.parawebsocket.stompClient.activate();
    } catch (e: any) { 
      this.errorMsg = 'Error al activar STOMP: ' + e.message;
    } 
  }
}
