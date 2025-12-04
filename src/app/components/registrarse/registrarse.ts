import { Component } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { Product} from '../../services/product';
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


  
  
constructor(private miServicio: Product,private fb: FormBuilder,private cdRef: ChangeDetectorRef,private router: Router) {
    //this.mensaje = this.miServicio.getData();
  //formulario registro
    this.formularioregistro = this.fb.group({
  username: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  name: [''],
  password: ['', [Validators.required, this.passwordValidator]]
});
    

}//constructor

  formularioregistrodatos() {
  if (this.formularioregistro.valid) {
    console.log('Payload:', this.formularioregistro.value); // para depurar
    alert('Payload que se envía:', this.formularioregistro.value);
    //this.formularioregistro.value envía todo el objeto ocsea tidos los campos 
    //a registrarDatos(user: any): Observable<any>
    this.miServicio.registrarDatos(this.formularioregistro.value).subscribe({
      next: res => {
        alert("Usuario registrado correctamente");
        this.router.navigate(['/']);
      },
      error: err => {
        alert('Usuario o correo ya existen');
      }
    });
  }
    }

  //modal
  modalAbierto = true;



cerrarModal() {
  this.modalAbierto = false;
  this.router.navigate(['/']);
  
}

  
}
