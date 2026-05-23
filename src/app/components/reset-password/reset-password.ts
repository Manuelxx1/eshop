import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../services/product';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  resetForm: FormGroup;
  token!: string;
  mensajerror:string='';
  successMessage:string='';
 
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private productService: Product) 
  { // Crear el formulario
  this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Leer el token de la URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      const newPassword = this.resetForm.value.newPassword;
      this.productService.resetPassword(this.token, newPassword).subscribe({
        next: (response) => {
        // response.message viene del backend
        alert(response.message); 
        // También podés guardarlo en una variable para mostrarlo en el template
        this.successMessage = response.message;
      },
        error: (err) =>{ 
          alert('Error al actualizar contraseña: ' + err.message);
        this.mensajerror=err.message;
        }
      });
    }
  }

}
