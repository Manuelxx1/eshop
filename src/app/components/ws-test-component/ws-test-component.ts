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

  //  Esta es la propiedad que faltaba
  notifications: string[] = [];
  //para el chat
  mensajes: string[] = [];
 
  constructor(public parawebsocket: Parawebsocket,private cd: ChangeDetectorRef  ) {}
  ngOnInit(): void { 
    // Escuchar cuando se conecta
    this.parawebsocket.stompClient.onConnect = (frame) => {
      this.conexionActiva = true;
      //  Aquí te suscribís al topic que envía el backend 
      this.parawebsocket.stompClient.subscribe('/topic/notificaciones', (message) => { 
        // Cada vez que llega un mensaje, lo agregamos a la lista 
        this.notifications.push(message.body); 
      });
      this.errorMsg = ''; // Limpiamos errores
      this.cd.detectChanges();
    };//onConnect

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

    //para el chat 
    this.parawebsocket.connect((msg: string) => {
      this.mensajes.push(msg);
    });
  
        }
//para el chat 
  enviar() { 
    if (this.mensaje.trim()) {
      this.parawebsocket.sendMessage(this.mensaje);
      this.mensaje = '';
    } 
  }

  sendTestNotification(): void {
  this.parawebsocket.sendNotification('Hola desde Angular 🚀');
}

}
