import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
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
  datosdesesion:any;
  sesionActivaSinGoogle: boolean = false;
  
  datosDebug: string = '';

  
  //para el dropdawn de compra directa 
  // Control reactivo para la cantidad
  quantityControl = new FormControl(1);
quantities: number[] = [1, 2, 3, 4, 5, 10]; // podés ajustar según el tipo de producto


  showSummary = false; //  flag para mostrar resumen
  
  lastOrderId: number | null = null; // acá guardamos el ID dinámico
initPointUrl: string | null = null;
  errorredir: string | null = null;

  constructor(private productService: Product, private cartService: Cart,private router: Router,private fb: FormBuilder ) {
//formulario login
    this.formulariologin = this.fb.group({
    nombre: ['', Validators.required],
      password: ['', Validators.required]
    //email: ['', [Validators.required, Validators.email]]
  });
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

    
    // Supongamos que ya obtuviste el orderId desde el backend
  // Si ya tenemos un pedido creado, lo consultamos
   /* if (this.lastOrderId) {
      this.productService.getOrder(this.lastOrderId).subscribe(data => {
        this.order = data;
      });
      }
      */
      //sin login
   /* this.productService.getOrders().subscribe(data => {
        this.orders = data;
      });

*/
      //traer orders o pedidos usando datos de login
      //para que sea dinámico usar localStorage en vez de Pruebacheckout 
      const loginUsername = 'Pruebacheckout'; // el usuario logueado
    this.productService.getOrdersByLogin(loginUsername).subscribe(data => {
      this.orders = data;
    });

      //llama a la sesión session en localStorage 
      //cuando se recargue la página por algún motivo
      this.session();

      
    }//ngOnInit 

//esto en realidad no es necesario aquí porque el carrito se muestra
  //en el component cart y este metodo loadCart ya esta alli 
  //y se muestra en la  vista cart html
  //se deveria ajustar el suscribe del método 
//addToCart a un console.log y nada más 
  //Asi se puede eliminar este metodo
  //sin se que produzca un error
  loadCart(): void {
  this.cartService.getItems().subscribe({
    next: (data) => {
      this.items = data;
      this.total = this.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
    },
    error: (err) => {
      console.error('Error al cargar el carrito', err);
    }
  });
      }



      formulariologindatos() {
if (this.formulariologin.valid) {

  const nombre = this.formulariologin.value.nombre;
    const password = this.formulariologin.value.password;

    this.datosDebug = `Enviando: ${nombre} / ${password}`;
      
  
  this.productService.iniciarSesion(this.formulariologin.value.nombre,this.formulariologin.value.password).subscribe({
      next: res => {
    // Login exitoso
    console.log('Login OK:', res);
//agregar los datos de la response a la property 
        this.datosDebug += `\nRespuesta: ${JSON.stringify(res)}`;
   
        //  Guardar sesión en localStorage
        localStorage.setItem('usuario', res.usuario);

this.session();
        
        alert(res.mensaje); //mensaje del.backend por ejemplo: "Login exitoso"
    //this.router.navigate(['/']); // redirige al perfil
  },
  error: err => {
    // Login fallido
    console.error('Error de login:', err);

    this.datosDebug += `\nError: ${JSON.stringify(err)}`;
    alert('Nombre o contraseña incorrectos');
  }
});
  } else {
    alert('Por favor completá todos los campos');
  }
      
    }

    

  session(){
  const usuarioGuardado = localStorage.getItem('usuario');
    this.sesionActivaSinGoogle = true; // true si hay sesión
  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    console.log('Usuario en sesión:', usuario);
    this.datosdesesion = 'Usuario en sesión<br>' + usuario;

  }
  }

      //cerrar session
  
      cerrarSesion() {
  localStorage.removeItem('usuario'); // Elimina la sesión
      //si quiero borrar todos los datos
        //de session
        //incluido el usuario
        //localStorage.clear();
        this.sesionActivaSinGoogle = false;
this.datosdesesion ="";
  //this.router.navigate(['/']);   // Redirige al login o donde prefieras
      }
  

  addToCart(product: any): void {
  this.cartService.addToCart(product.id, 1).subscribe({
    next: () => this.loadCart(),
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
  const selectedQuantity = this.quantityControl.value ?? 1;
  console.log('Cantidad seleccionada:', selectedQuantity);

  // recuperar usuario de la sesión (guardado en login)
  const usuario = localStorage.getItem('usuario');

  this.productService.comprar(productId, selectedQuantity, usuario).subscribe({
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


  






