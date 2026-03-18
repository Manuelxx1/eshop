import { Component,HostListener,OnInit,OnDestroy } from '@angular/core';
import { WsTestComponent } from '../ws-test-component/ws-test-component';

/*
Como Order ya incluye dentro los items, 
y cada item incluye el product,
no hace falta importar User, 
Product ni OrderItem en el componente. 
Angular ya sabe la estructura 
porque está anidada dentro de Order

*/
import { Product,Order} from '../../services/product';
import { CommonModule } from '@angular/common';
import { RouterOutlet,RouterLink } from '@angular/router';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { Cart} from '../../services/cart';
//se importa la interfaz CartItem que representa al modelo
import { CartItem } from '../../services/cart'; // ajustá el path si hace falta



interface Actividad {
  id?: string;              // opcional, sirve para evitar duplicados
  fecha: Date | string;     // puede venir como Date o string del backend
  tipo: string;
  descripcion: string;
}



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink,WsTestComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})


  


export class ProductList implements OnInit,OnDestroy {
  //recibir datos del formulario buscador
  searchControl = new FormControl('');

  products: any[] = [];
  loading = true;
  error = false;
  orders: Order[] = [];
  items: CartItem[] = [];
total: number = 0;


//para el login
  formulariologin: FormGroup;
  sesionActivaSinGoogle = false;
  datosDebug: string = '';
  email:string = '';   
  fechaderegistro=any;
  //para el dropdawn de compra directa 
  // Control reactivo para la cantidad
  //formato con declaración de tipado 
  //se me asigna el valor por defecto 1
  //y se define no nulo para que no surga error
  quantityControl = new FormControl<number>(1, { nonNullable: true });

quantities: number[] = [1, 2, 3, 4, 5, 10]; // podés ajustar según el tipo de producto


  showSummary = false; //  flag para mostrar resumen
  
  lastOrderId: number | null = null; // acá guardamos el ID dinámico
initPointUrl: string | null = null;
  errorredir: string | null = null;




  


//2FA validar 
  
  twofaForm: FormGroup;
  step = 1;
  message = '';

  checkoutForm: FormGroup;
  //opciones de envío
  shippingOptions = [
  { id: 'standard', name: 'Envío estándar (3-5 días)', price: 5.99 },
  { id: 'express', name: 'Envío exprés (1-2 días)', price: 12.99 },
  { id: 'pickup', name: 'Retiro en tienda', price: 0.0 }
];

// Control reactivo para la opción seleccionada 
  //shippingControl = new FormControl(this.shippingOptions[0]);


  constructor(private productService: Product, private cartService: Cart,private router: Router,private fb: FormBuilder ) {
//formulario login
    this.formulariologin = this.fb.group({
    username: ['', Validators.required],
      password: ['', Validators.required]
    //email: ['', [Validators.required, Validators.email]]
  });




    //obtener datos personales para envío 
this.checkoutForm = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: [''],
  address: ['', Validators.required],
  city: ['', Validators.required],
  postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]],
  shippingOption: [null, Validators.required]   //  arranca en null
});


    //Recibir Código 2FA
    this.twofaForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
    
  }// constructor 


  //para el stepper guía al usuario 
currentStep = 1;
selectedProduct: any;

selectProduct(product: any) {
  this.selectedProduct = product;
  this.currentStep = 2;
}


  
  goNext() {
  this.currentStep++;
}



goBack() {
  if (this.currentStep > 1) {
    this.currentStep--;
    // Si vuelve al primer paso,para cambiar de producto reseteamos el envío
    //para qye el usuario pueda elegir la opcion que le conviene
    if (this.currentStep === 1) {
      this.checkoutForm.get('shippingOption')?.reset(null);
    }
  }
}

      
  
    ngOnInit(): void {
      
          this.searchControl.valueChanges.subscribe(term => {
      const query = term?.trim();
      if (query && query.length >= 2) {
        this.loading = true;
        this.productService.searchProducts(query).subscribe({
          next: data => {
            this.products = data;
            this.loading = false;
            this.error = false;
          },
          error: err => {
            console.error('Error al buscar productos', err);
            this.products = [];
            this.loading = false;
            this.error = true;
          }
        });
      } else {
        this.products = [];
      }
    });

    }//ngOnInit 



      







  
  


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






  
  




  
  
  addToCart(product: any): void {
  const quantity = this.quantityControl.value; //  acá tomás el valor del select
  const idUsuario = Number(localStorage.getItem('idUsuario'));

    this.cartService.addToCart(product.id, quantity,idUsuario ).subscribe({
    next: (res) =>console.log("Error backend:", res); ,
    error: err => console.error('Error al agregar al carrito', err)
      
  });
}


//mostrar resumen de compra antes de confirmar compra 
mostrarResumen(): void {
    this.showSummary = true;
}



  
// Compra directa → redirige al checkout
buyNow(productId: number): void {
  alert("Botón comprar clickeado ");
  alert("productId del frontend" + productId);
  const selectedQuantity = this.quantityControl.value ?? 1;
  console.log('Cantidad seleccionada:', selectedQuantity);
//const shippingOption = this.shippingControl.value;
  const formData = this.checkoutForm.value;
  console.log('Datos del comprador:', formData);
  // recuperar usuario de la sesión (guardado en login)
  const valorId = localStorage.getItem('idUsuario');
  const idUsuario = valorId ? Number(valorId) : null; //  conversión a número
alert("Usuario del login" +idUsuario);
  this.productService.comprar(productId, selectedQuantity, idUsuario,formData).subscribe({
    next: initPoint => {
      alert("initPoint recibido: " + initPoint);
      localStorage.setItem('selectedProduct', JSON.stringify(productId));

      // redirige al checkout de Mercado Pago
      window.location.href = initPoint;
    },
    error: err => {
      alert("Error al llamar al backend: " + JSON.stringify(err));
      this.errorredir = JSON.stringify(err);
    }
  });
}


}


  






