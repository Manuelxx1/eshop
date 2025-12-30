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
}
  

