import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
//import * as SockJS from 'sockjs-client'; // Cambia el import a este formato

import { Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root',
})
  
export class Parawebsocket {
  public stompClient: Client;
  public ultimosLogs: string = ""; // Añade esta variable
  constructor() { 
    this.stompClient = new Client({
      // Aquí está el truco: usamos (SockJS as any) para saltar la restricción de tipo
      webSocketFactory: () => new SockJS('https://portfoliowebbackendkoyeb-1-ulka.onrender.com/ws'),
      reconnectDelay: 5000, 
      debug: (str) => {
        this.ultimosLogs = str; // Guardamos lo que pasa internamente
        console.log(str);
      },
    });
  }

  sendNotification(payload: string) {
  this.stompClient.publish({
    destination: '/app/notify',   //  coincide con @MessageMapping("/notify") en tu backend
    body: payload                 //  el contenido del mensaje
  });
}

  connect(onNotify: (msg: string) => void, onChat: (msg: string) => void) {
  this.stompClient.onConnect = () => {
    // Suscripción a notificaciones
    this.stompClient.subscribe('/topic/notificaciones', (message) => {
      onNotify(message.body);
    });

    // Suscripción al chat
    this.stompClient.subscribe('/topic/mensajes', (message) => {
      onChat(message.body);
    });
  };

  this.stompClient.onWebSocketError = () => {
    console.error('Error de Red: No se pudo alcanzar el servidor');
  };

  this.stompClient.onStompError = (frame) => {
    console.error('Error STOMP: ' + frame.headers['message']);
  };

  this.stompClient.activate();
}


  //mensajes del chat
  sendMessage(msg: string) { 
    this.stompClient.publish({ destination: '/app/chat', body: msg }); 
  }

}
  

