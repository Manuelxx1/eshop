import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../services/product';

@Component({
  selector: 'app-reset-password',
  imports: [],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  resetForm: FormGroup;
  token: string;

  constructor(
    private fb: FormBuilder, private route: ActivatedRoute, private productService: Product) 
  {
    // Crear el formulario
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
        next: () => alert('Contraseña actualizada correctamente'),
        error: (err) => alert('Error al actualizar contraseña: ' + err.message)
      });
    }
  }

}
