import { Component } from '@angular/core';
import { Product} from '../../services/product';
import { CommonModule } from '@angular/common';
import { RouterOutlet,RouterLink } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})


  export class Login  {
  //para el login
  formulariologin: FormGroup;
  sesionActivaSinGoogle = false;

  //2FA validar 
  
  twofaForm: FormGroup;
  step = 1;
  message = '';

  constructor(private productService: Product,private router: Router,private fb: FormBuilder ) {
//formulario login
    this.formulariologin = this.fb.group({
    username: ['', Validators.required],
      password: ['', Validators.required]
    //email: ['', [Validators.required, Validators.email]]
  });

      //Recibir Código 2FA
    this.twofaForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
}//constructor 

}
  
