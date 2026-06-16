
/*
import { Component } from '@angular/core';

@Component({
  selector: 'app-ciberseguridad2',
  imports: [],
  templateUrl: './ciberseguridad2.html',
  styleUrl: './ciberseguridad2.css',
})
export class CiberSeguridad2
{

}
*/
import { Component } from '@angular/core';

@Component({
  selector: 'app-ciberseguridad2',
  standalone: true,
  imports: [],
  template: `<h2>Si podés ver esto, la ruta funciona perfectamente</h2>` 
  // Usamos un template en línea corto para descartar fallas en el .html externo
})
export class CiberSeguridad2 {
  constructor() {
    console.log("Componente CiberSeguridad2 cargado con éxito");
  }
}
