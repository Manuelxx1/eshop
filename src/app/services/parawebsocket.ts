import { Injectable } from '@angular/core';
//import SockJS from 'sockjs-client';
import * as SockJS from 'sockjs-client'; // Cambia el import a este formato

import { Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root',
})
  
export class Parawebsocket {
  public stompClient: Client;
  constructor() { 
    this.stompClient = new Client({
      // Aquí está el truco: usamos (SockJS as any) para saltar la restricción de tipo
      webSocketFactory: () => new (SockJS as any)('https://portfoliowebbackendkoyeb-1-ulka.onrender.com/ws'),
      reconnectDelay: 5000, 
      debug: (str) => console.log(str),
    });
  }
}
  

