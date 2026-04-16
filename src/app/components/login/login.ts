import { Component } from '@angular/core';
import { Product} from '../../services/product';
import { CommonModule } from '@angular/common';
import { RouterOutlet,RouterLink } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Cart } from '../../services/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})


  export class Login  {
  //para el login
  formulariologin: FormGroup;
  sesionActivaSinGoogle = false;
  email:string = '';  
  fechaderegistro:any;
  nombre:string ='';

  //2FA validar 
  
  twofaForm: FormGroup;
  step = 1;
  message = '';

  constructor(private productService: Product,private cartService:Cart,private router: Router,private fb: FormBuilder ) {
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

  formulariologindatos() {
if (this.formulariologin.valid) {

  const nombre = this.formulariologin.value.username;
    const password = this.formulariologin.value.password;

    //this.datosDebug = `Enviando: ${nombre} / ${password}`;
      
  
  this.productService.iniciarSesion(this.formulariologin.value.username,this.formulariologin.value.password).subscribe({
      next: res => {
        if (res.status === 202) {
      // Mostrar formulario de ingreso de código 2FA
      console.log("Login pendiente de 2FA:", res.body.mensaje);
         // Si usás observe: 'response'
          // res.body es un objeto con varias propiedades (id, usuario, mensaje, etc.).
//entonces se accede asi
          alert("Credenciales de sesion correctas Login pendiente de 2FA:" + res.body.mensaje);
   // Si NO usás observe: 'response'
         // En ese caso, Angular te devuelve directamente el body (el JSON)
          //Ahí deberías hacer simplemente:
         // alert("Credenciales de sesion correctas Login pendiente de 2FA:" + res.mensaje);
         this.email = res.body.email;
          this.step = 2;
          
          } 
        
  },
  error: err => {
    // Login fallido
    if (err.status === 401) {
    console.error('Error de login:', err);
this.message = 'Credenciales inválidas';
    //this.datosDebug += `\nError: ${JSON.stringify(err)}`;
    alert('Nombre o contraseña incorrectos');
  }
  }
});
  } else {
    alert('Por favor completá todos los campos');
  }
      
    }//formulariologin 


  //Validar 2FA
    onValidateCode() {
  const code = this.twofaForm.value.code;
  alert("Validando con email:"+this.email+"y código:"+code);

  this.productService.validateCode(this.email, code).subscribe({
    next: (res) => {
      
      if (res.status === 200) {
        alert("Bienvenido " + res.body.name + " - " + res.body.mensaje);
        // Login completo
     // console.log("Login exitoso:", res.body);
          //alert("Login exitoso:" + res.body);
      
    
        
//agregar los datos de la response a la property 
       // this.datosDebug += `\nRespuesta: ${JSON.stringify(res)}`;
   
        // Guardar sesión en localStorage usando res.body
    localStorage.setItem('idUsuario', res.body.id);
    localStorage.setItem('usuario', res.body.usuario);
    localStorage.setItem('email', res.body.email);
    localStorage.setItem('name', res.body.name);
    localStorage.setItem('createdAt', res.body.createdAt);

    this.nombre = res.body.name;
    this.email = res.body.email;
    this.fechaderegistro = res.body.createdAt;
    this.message = res.body.mensaje;

    
        
//this.cargarDatosDashboard(res.usuario);
     
        this.onLoginSuccess(res.body.id);
  


        
        
        alert(res.body.id); //mensaje del.backend por ejemplo: "Login exitoso"
        
        this.router.navigate(['/dashboard']);
        
      }
    },
    error: (err) => {
      console.error("Error backend:", err);
      this.message = err.error?.error || "Error de seguridad";
      alert ("Error en la validación"+err);
      alert ("Error en la validación"+err.error);
      alert ("Error en la validación"+err.error?.error || "Error de seguridad");
    alert ("Error en la validación"+err.body.error);
    }
    
  });
}

  onLoginSuccess(userId: number) {
  this.cartService.migrateLocalCartToBackend(userId).subscribe({
    next: () => {
      console.log('Carrito migrado y sincronizado con backend');
      alert('Carrito migrado y sincronizado con backend');
    },
    error: (err: any) => console.error('Error al migrar carrito', err);
    alert('Error no se migro el carrito al backend');
  });
}



}
  
