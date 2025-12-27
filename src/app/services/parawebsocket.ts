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
      webSocketFactory: () => new SockJS('https://portfoliowebbackendkoyeb-1-ulka.onrender.com/ws'),
      reconnectDelay: 5000, 
      debug: (str) => console.log(str),
    });
  } 
}
  

