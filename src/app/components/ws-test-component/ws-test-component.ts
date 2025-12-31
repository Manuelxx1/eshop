import { Component, OnInit,ChangeDetectorRef   } from '@angular/core';
import { Parawebsocket } from '../../services/parawebsocket';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ws-test-component',
  imports: [CommonModule,ReactiveFormsModule],
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
  // FormControl en lugar de ngModel
  mensajeControl = new FormControl('');
 
  constructor(public parawebsocket: Parawebsocket,private cd: ChangeDetectorRef  ) {}
  ngOnInit(): void { 
    // Escuchar cuando se conecta
    // Configurar qué pasa cuando se conecta 
    this.parawebsocket.stompClient.onConnect = (frame) => { 
      this.conexionActiva = true;
      // Suscripción a notificaciones 
      this.parawebsocket.stompClient.subscribe('/topic/notificaciones', (message) => { 
        this.notifications.push(message.body); 
        this.cd.detectChanges();
      }); 
      // Suscripción al chat
      this.parawebsocket.stompClient.subscribe('/topic/mensajes', (message) => { 
        this.mensajes.push(message.body); 
        this.cd.detectChanges(); }); 
      this.errorMsg = ''; // Limpiamos errores
    }; 

    this.parawebsocket.stompClient.subscribe('/topic/carrito', (message) => { 
        this.notifications.push(message.body); 
        this.cd.detectChanges();
      }); 
    // Manejo de errores 
    this.parawebsocket.stompClient.onWebSocketError = () => { 
      this.errorMsg = 'Error de Red: No se pudo alcanzar el servidor';
      this.cd.detectChanges(); 
    }; 
    this.parawebsocket.stompClient.onStompError = (frame) => {
      this.errorMsg = 'Error STOMP: ' + frame.headers['message']; 
      this.cd.detectChanges(); 
    }; 
    // Activar la conexión (solo una vez)
    this.parawebsocket.stompClient.activate();
  
        }
//para el chat 
 enviar() {
   const texto = this.mensajeControl.value?.trim(); 
   if (texto) { 
     this.parawebsocket.sendMessage(texto); 
     this.mensajeControl.reset(); // limpia el input
   } 
 }

  sendTestNotification(): void {
  this.parawebsocket.sendNotification('Hola desde Angular 🚀');
}

}
