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

    
        


        
        
        alert(res.body.id); //mensaje del.backend por ejemplo: "Login exitoso"
        
       
        


        // Decidir redirección
          // Caso: carrito completo
  const pendingCart = localStorage.getItem('pendingCart');

//const pendingCheckout = localStorage.getItem('pendingCheckout');
const pendingCheckout = this.productService.getPendingCheckout();
//const pendingCheckoutMenu = this.productService.getPendingCheckout();
const pendingCheckoutCategory = this.productService.getPendingCheckoutCategory();

        
  if (pendingCheckoutCategory?.value) {
  switch (pendingCheckoutCategory?.type) {
    case 'product':
      // Redirige a la categoría guardada junto con el producto
      this.router.navigate(['/categoria', pendingCheckoutCategory.value.category]);
      break;

    
    case 'category':
      this.router.navigate(['/categoria', pendingCheckoutCategory.value]);
      break;

    default:
      alert("datos del pendingCheckoutCategory en login "+pendingCheckoutCategory.value);
      this.router.navigate(['/']);
  }

    } else if (pendingCheckout?.type="allproducts") {
    // Si había un carrito pendiente → redirige al carrito
    alert("datos del pendingCheckout en login para menu "+pendingCheckout.productId);
    this.router.navigate(['/productos']);
  
    // Última intención: producto puntual
    //tiene prioridad sobre un carrito guardado anteriormente
    // Si había un producto pendiente → redirige a productos
    //usando la condición pendingCheckout     
   } else if (pendingCheckout?.type="featured") {
    // Si había un carrito pendiente → redirige al carrito
    alert("datos del pendingCheckout en login "+pendingCheckout.productId);
    this.router.navigate(['/']);
  
  } 
  
  else if (pendingCart) {
    // Si había un carrito pendiente → redirige al carrito
    this.router.navigate(['/cart']);
  } else {
    // Si no hay nada pendiente → redirige al dashboard
    this.router.navigate(['/dashboard']);
  }

                // Migrar carrito
        this.onLoginSuccess(res.body.id);
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
  this.cartService.getCart(userId).subscribe(cart => {
    if (cart && cart.length > 0) {
      this.cartService.migrateLocalCartToBackend(userId).subscribe({
        next: () => {
          console.log('Carrito migrado y sincronizado con backend');
          alert('Carrito migrado y sincronizado con backend');
        },
        error: (err: any) => {
          console.error('Error al migrar carrito', err);
          alert('Error: no se migró el carrito al backend');
        }
      });
    } else {
      console.log('No había productos en el carrito local, nada que migrar');
    }
  });
}




}
  
