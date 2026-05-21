import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet,RouterLink } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  constructor(private loginService: LoginService, private cartService: Cart,private router: Router,private fb: FormBuilder,private route: ActivatedRoute) {

forgotPasswordForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]]
});
  }

onSubmit() {
  this.loginService.sendPasswordReset(this.forgotPasswordForm.value.email)
    .subscribe(() => alert('Se envió un enlace de recuperación a su correo'));
}



}
