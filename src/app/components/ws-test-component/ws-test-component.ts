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
    this.parawebsocket.connect( (notifyMsg: string) => { 
      this.conexionActiva = true; 
      this.notifications.push(notifyMsg); 
      this.errorMsg = ''; 
      this.cd.detectChanges(); 
    }, (chatMsg: string) => { 
      this.mensajes.push(chatMsg);
      this.cd.detectChanges();
    });

  
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
