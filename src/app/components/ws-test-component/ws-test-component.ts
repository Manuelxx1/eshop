import { Component, OnInit,ChangeDetectorRef   } from '@angular/core';
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
  constructor(public parawebsocket: Parawebsocket,private cd: ChangeDetectorRef  ) {}
  ngOnInit(): void { 
    // Escuchar cuando se conecta
    this.parawebsocket.stompClient.onConnect = (frame) => {
      this.conexionActiva = true;
      this.errorMsg = ''; // Limpiamos errores
      this.cd.detectChanges();
    };

    // Escuchar si hay errores de conexión (esto nos dirá por qué no conecta)
    this.parawebsocket.stompClient.onWebSocketError = (event) => {
      this.errorMsg = 'Error de Red: No se pudo alcanzar el servidor';
      this.cd.detectChanges();
    };

    this.parawebsocket.stompClient.onStompError = (frame) => {
      this.errorMsg = 'Error STOMP: ' + frame.headers['message'];
      this.cd.detectChanges();
    };

    // Intentar conectar
    this.parawebsocket.stompClient.activate();
}

  sendTestNotification(): void {
  this.parawebsocket.sendNotification('Hola desde Angular 🚀');
}

}
