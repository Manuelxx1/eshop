import { Component } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { Busquedaservice } from '../busquedaservice';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { ThemeToggleComponent } from './theme-toggle-component/theme-toggle-component';
//import { Weather } from './weather/weather';
//import { CryptoPrices } from './crypto-prices/crypto-prices';

import { CommonModule } from '@angular/common';

import { ChangeDetectorRef } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-registrarse',
  imports: [ HttpClientModule,CommonModule,ReactiveFormsModule,RouterLink ],
  templateUrl: './registrarse.html',
  styleUrl: './registrarse.css'
})
export class Registrarse {
  formularioregistro:FormGroup;
datosdesesion:any;

//método para el validator password 
  //mensaje dinámico para el usuario
passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const errors: any = {};

  if (value.length < 8) {
    errors.minLength = true;
  }
  if (!/[A-Z]/.test(value)) {
    errors.uppercase = true;
  }
  if (!/[a-z]/.test(value)) {
    errors.lowercase = true;
  }
  if (!/\d/.test(value)) {
    errors.number = true;
  }
  if (!/[!@#$%^&*()_+=\-{}\[\]:;"'<>,.?/]/.test(value)) {
    errors.symbol = true;
  }

  return Object.keys(errors).length ? errors : null;
}

//aviso de seguridad del pasword
get passwordStrength(): number {
  const value = this.formularioregistro.get('password')?.value || '';
  let strength = 0;

  if (value.length >= 8) strength += 1;
  if (/[A-Z]/.test(value)) strength += 1;
  if (/[a-z]/.test(value)) strength += 1;
  if (/\d/.test(value)) strength += 1;
  if (/[!@#$%^&*()_+=\-{}\[\]:;"'<>,.?/]/.test(value)) strength += 1;

  return strength; // Máximo 5
}


  
  
constructor(private miServicio: Busquedaservice,private fb: FormBuilder,private cdRef: ChangeDetectorRef,private router: Router) {
    //this.mensaje = this.miServicio.getData();
  //formulario registro
    this.formularioregistro = this.fb.group({
    nombre: ['', Validators.required],
      password: [
    '',
    [
      Validators.required,this.passwordValidator]
  ]
      //Validators.pattern no dinámico
// Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+=\\-{}\\[\\]:;"\'<>,.?/]).{8,}$')

    //email: ['', [Validators.required, Validators.email]]
  });
    

}//constructor

  formularioregistrodatos() {
if (this.formularioregistro.valid) {
      this.miServicio.registrarDatos(this.formularioregistro.value.nombre,this.formularioregistro.value.password).subscribe({
      next: res => {
    // Login exitoso
    console.log('Login OK:', res);
   this.datosdesesion = res;
        alert("datos registrados"); //mensaje del.backend por ejemplo: "Login exitoso"
    this.router.navigate(['/']); // redirige al perfil
  },
  error: err => {
    // Login fallido
    console.error('Error de login:', err);
    alert('Nombre o contraseña ya existen');
  }
});
  } else {
    alert('Por favor completá todos los campos');
  }
      
    }

  //modal
  modalAbierto = true;



cerrarModal() {
  this.modalAbierto = false;
  this.router.navigate(['/']);
  
}

  
}
