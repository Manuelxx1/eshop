import { Component } from '@angular/core';
import { Product} from '../../services/product';
import { CommonModule } from '@angular/common';
import { RouterOutlet,RouterLink } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-username',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './forgot-username.html',
  styleUrl: './forgot-username.css',
})
export class ForgotUsername {
  forgotUsernameForm: FormGroup;

  constructor(private productService: Product,private router: Router,private fb: FormBuilder,private route: ActivatedRoute) {

this.forgotUsernameForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]]
});

  }


    onSubmit() {
  this.productService.sendUsernameReset(this.forgotUsernameForm.value.email).subscribe(() => alert('Se envió un enlace de recuperación a su correo'));
    }

}
