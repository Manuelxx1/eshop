import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  sesionActivaSinGoogle = false;
  datosdesesion: string = "";

  constructor(private router: Router ) {
    
  }

  ngOnInit(): void {
    this.session(); //  se ejecuta al cargar el dashboard
  }

  session() {
    const usuarioGuardado = localStorage.getItem('usuario');
    const id = localStorage.getItem('idUsuario');
    if (usuarioGuardado) {
      this.sesionActivaSinGoogle = true;
      this.datosdesesion = usuarioGuardado;
      this.idUsuario = id;
    } else {
      this.sesionActivaSinGoogle = false;
      this.datosdesesion = "";
      
    }
  }

  cerrarSesion() {
    localStorage.clear();
    this.sesionActivaSinGoogle = false;
    this.datosdesesion = "";
    
    // Redirigir al inicio o login
    this.router.navigate(['/']);
  }

}
