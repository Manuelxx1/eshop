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
  datosdesesion:any;
  sesionActivaSinGoogle: boolean = false;
  private timeoutId: any;
  private warningId: any;
  private tiempoInactividad = 5 * 60 * 1000; // 5 minutos
  private tiempoAdvertencia = 1 * 60 * 1000; // 1 minuto antes
 mostrarAdvertencia = false;
  
  datosDebug: string = '';

  
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




  
//dashboard de usuario 
  estadisticas: any = {};
actividad: Actividad[] = [];
  email: string | null = null;
nombre: string | null = null;
  fechaderegistro:any;
seccionActiva: string = 'perfil'; // por defecto
passwordForm: FormGroup;
  usernameForm: FormGroup;
  emailForm:FormGroup;
  mensajedecambiousername:any;
  mensajedecambiopassword:any;
  mensajedecambioemail:any;
  intervalId: any;//detener setInterval por si salimos del componente paea evitar llamadas innecesarios al backend
// Podés cambiar la sección desde el menú con (click)
emaildedb:any;
  //Notifications mediante websocket 
  notifications: string[] = [];
  conexionActiva = false;

  constructor(private productService: Product, private cartService: Cart,private router: Router,private fb: FormBuilder ) {
//formulario login
    this.formulariologin = this.fb.group({
    nombre: ['', Validators.required],
      password: ['', Validators.required]
    //email: ['', [Validators.required, Validators.email]]
  });

//para cambiar contraseña dashboard 
this.passwordForm = this.fb.group({
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.usernameForm = this.fb.group({
      nuevoUsername: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.emailForm = this.fb.group({
      nuevoEmail: ['', [Validators.required, Validators.minLength(6)]]
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

    
    
      //traer orders o pedidos usando datos de login
      //para que sea dinámico usar localStorage en vez de Pruebacheckout 
     
      //Así solo llamás al servicio si existe un usuario en sesión
      //y se evita llamar al service con undato null
      //para que no surga error de datos ya que el método 
      //en el service espera solamente un string y no un null
      //localStorage.getItem retorna siempre yn string 
      //por eso lo Convertimos a number para enviarlo al método cargarDatosDashboard
      
      
      //con setInterval llamamos cada 5 segundos al dashboard
      //así se reflejam los cambios automáticamente 
      this.cargarDatosDashboard(Number(localStorage.getItem('idUsuario')));

  this.intervalId = setInterval(() => {
    const dashboardid = Number(localStorage.getItem('idUsuario'));
    if (dashboardid) {
      this.cargarDatosDashboard(dashboardid);
    }

    const dataActividad = localStorage.getItem('actividad');
    this.actividad = dataActividad ? JSON.parse(dataActividad) : [];
  }, 5000);


  



      //llama a la sesión session en localStorage 
      //cuando se recargue la página por algún motivo
      this.session();

     //reset timer de cerrar sesión por inactividad 
this.resetTimer();

//para el perfil del dashboard 
      
  //usamos localstorage para persistir datos por navegador 
      
      // y si se recarga el navegador no se borren los datos de la vista
  this.email = localStorage.getItem('email');
      this.nombre = localStorage.getItem('name');
this.fechaderegistro = localStorage.getItem('createdAt');



    
    }//ngOnInit 



      
//detenenos a setInterval cuando salimos del componente 
  //asi se evita llamar al backend innecesariamente

      
      ngOnDestroy() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
  
}

//método para cambiar contraseña dashboard 
updatePassword() {
    if (this.passwordForm.valid) {
      const usuario = localStorage.getItem('usuario');
      const nuevaPassword = this.passwordForm.value.nuevaPassword;

      this.productService.updatePassword(usuario!, nuevaPassword).subscribe(res => {
        if (res.success) {
          // Registrar actividad
          this.actividad.push({
            fecha: new Date(),
            tipo: 'Configuración',
            descripcion: `Contraseña actualizada para ${usuario}`
          });
// Guardar en localStorage
localStorage.setItem('actividad', JSON.stringify(this.actividad));
          // Ordenar cronológicamente
          this.actividad.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

          // Resetear formulario
          this.passwordForm.reset();
          this.mensajedecambiopassword=res.mensajecontraseña;
        }
      });
    }
}



updateUsername() {
  if (this.usernameForm.valid) {
    const idUsuario = Number(localStorage.getItem('idUsuario')); // guardás el id al loguear
    const nuevoUsername = this.usernameForm.value.nuevoUsername;

    this.productService.updateUsername(idUsuario, nuevoUsername).subscribe(res => {
      if (res.success) {
        this.actividad.push({
          fecha: new Date(),
          tipo: 'Configuración',
          descripcion: `Nombre de usuario cambiado a ${nuevoUsername}`
        });

        localStorage.setItem('actividad', JSON.stringify(this.actividad));
        this.actividad.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        this.usernameForm.reset();
        this.mensajedecambiousername = res.mensajeusername;

        // actualizar el localStorage con el nuevo username
        localStorage.setItem('usuario', nuevoUsername);
        this.datosdesesion=res.usernameActualizado;
        
      }
    });
  }
}


  updateEmail() {
  if (this.emailForm.valid) {
    const idUsuario = Number(localStorage.getItem('idUsuario')); // guardás el id al loguear
    const nuevoEmail = this.emailForm.value.nuevoEmail;

    this.productService.updateEmail(idUsuario, nuevoEmail).subscribe(res => {
      if (res.success) {
        this.actividad.push({
          fecha: new Date(),
          tipo: 'Configuración',
          descripcion: `Email de usuario cambiado a ${nuevoEmail}`
        });

        localStorage.setItem('actividad', JSON.stringify(this.actividad));
        this.actividad.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        this.emailForm.reset();
        this.mensajedecambioemail = res.mensajemail;

        // actualizar el localStorage con el nuevo email 
       localStorage.setItem('email', res.emailactualizado);
     
        
        //se le asigna el valor de email actualizado de la db
        //para que muestre el cambio al instante 
        //y en ngOnInit se ke asigna el valor actualizado 
        //a través de localStorage por si se recarga el navegador 
        //para evitar perder el valor en this.email
        //y se pueda seguir mostrndo en ka vista 
        //de lo contrario habría qye crear un método 
        //que llame a un endpoint que retorne
        //el valor de email de la db y asignarlo a this.email 
        this.email = res.emailactualizado;
        
      }
    });
  }
 }




  
  private cargarDatosDashboard(idUsuario: number) {
  this.productService.getOrdersByLogin(idUsuario).subscribe(data => {
    this.orders = data;
    const ultimaOrden = data.length > 0 ? data[data.length - 1] : null;

const username = localStorage.getItem('usuario');
    //en la sección estadísticas los datos vienen del backend y db
    //en el suscribe data por eso no se usa localStorage 
    //como en otra sección donde hay datos que no vienen del backend 
    this.estadisticas = {
      totalGastado: data.reduce((acc, o) => acc + o.total, 0),
      compras: data.length,
      ultimaCompra: ultimaOrden ? ultimaOrden.createdAt : null,
      ultimoMonto: ultimaOrden ? ultimaOrden.total : 0,
      ultimoEstado: ultimaOrden ? ultimaOrden.status : ''
    };

    // Construir actividad desde cero
    const actividadNueva: Actividad[] = data.map(o => ({
      id: `order-${o.id}`,
      fecha: o.createdAt,
      tipo: 'Compra',
      descripcion: `Orden #${o.id} por ${o.total} ARS`
    }));

    // Agregar login (solo uno por sesión)
    actividadNueva.push({
      id: `login-${idUsuario}`,
      fecha: new Date(),
      tipo: 'Login',
      descripcion: `Inicio de sesión exitoso para ${username}`
    });

    // Recuperar eventos especiales (ej. cambio de contraseña) que ya estaban guardados
    const prevActividad = localStorage.getItem('actividad');
    const actividadGuardada: Actividad[] = prevActividad ? JSON.parse(prevActividad) : [];
    const eventosConfiguracion = actividadGuardada.filter(a => a.tipo === 'Configuración');

    // Fusionar: compras + login + configuraciones
    this.actividad = [...actividadNueva, ...eventosConfiguracion];

    // Ordenar cronológicamente
    this.actividad.sort(
      (a: Actividad, b: Actividad) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    // Guardar en localStorage
    localStorage.setItem('actividad', JSON.stringify(this.actividad));
  });
}


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

    //this.datosDebug = `Enviando: ${nombre} / ${password}`;
      
  
  this.productService.iniciarSesion(this.formulariologin.value.nombre,this.formulariologin.value.password).subscribe({
      next: res => {
    // Login exitoso
    console.log('Login OK:', res);
//agregar los datos de la response a la property 
       // this.datosDebug += `\nRespuesta: ${JSON.stringify(res)}`;
   
        //  Guardar sesión en localStorage
        localStorage.setItem('idUsuario', res.id);
        localStorage.setItem('usuario', res.usuario);
        localStorage.setItem('email', res.email);
          localStorage.setItem('name', res.name);
        localStorage.setItem('createdAt', res.createdAt);
         

this.nombre= res.name;
    this.email = res.email;
        
    this.fechaderegistro = res.createdAt;

//this.cargarDatosDashboard(res.usuario);
        
        this.session();
        
        alert(res.mensaje);
        alert(res.id); //mensaje del.backend por ejemplo: "Login exitoso"
    this.router.navigate(['/']); // redirige al perfil
  },
  error: err => {
    // Login fallido
    console.error('Error de login:', err);

    //this.datosDebug += `\nError: ${JSON.stringify(err)}`;
    alert('Nombre o contraseña incorrectos');
  }
});
  } else {
    alert('Por favor completá todos los campos');
  }
      
    }

    


  session(){
const usuarioGuardado = localStorage.getItem('usuario');
    const id = localStorage.getItem('idUsuario');
  if (usuarioGuardado) {
    this.sesionActivaSinGoogle = true;
    this.datosdesesion = usuarioGuardado ;
  } else {
    this.sesionActivaSinGoogle = false;
    this.datosdesesion = "";
    
  }
  }

      //cerrar session
  
      cerrarSesion() {
  localStorage.removeItem('usuario'); // Elimina la sesión
     //si quiero borrar todos los datos
        //de session
        //incluido el usuario
        //localStorage.clear();
        localStorage.clear();
        this.mostrarAdvertencia = false;
        this.sesionActivaSinGoogle = false;
this.datosdesesion ="";
        this.mensajedecambiopassword=null;
    this.mensajedecambiousername=null;
  //this.router.navigate(['/']);   // Redirige al login o donde prefieras
      }


  
  //mantener la session al dar ok en el modal de advertencia 
mantenerSesion(): void {
    this.mostrarAdvertencia = false;
    this.resetTimer(); // reinicia temporizador
    console.log("Sesión mantenida por el usuario");
}
  

/*Resultado
Si el usuario está inactivo 4 minutos → aparece el mensaje de advertencia.

Si pasa 1 minuto más sin actividad → se ejecuta cerrarSesion().

Si el usuario mueve el mouse, hace click o escribe → se reinicia el temporizador y desaparece la advertencia.
  */
  //  Escuchar actividad del usuario
  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:click')
  resetTimer(): void {
    clearTimeout(this.timeoutId);
    clearTimeout(this.warningId);
    this.mostrarAdvertencia = false;

    // Programar advertencia
    this.warningId = setTimeout(() => {
      this.mostrarAdvertencia = true;
      
    }, this.tiempoInactividad - this.tiempoAdvertencia);

    // Programar cierre
    this.timeoutId = setTimeout(() => this.cerrarSesion(), this.tiempoInactividad);
  }
  


  
  
  addToCart(product: any): void {
  const quantity = this.quantityControl.value; //  acá tomás el valor del select
  const idUsuario = Number(localStorage.getItem('idUsuario'));

    this.cartService.addToCart(product.id, quantity,idUsuario ).subscribe({
      
    //next: () => this.loadCart(),
        next: cart => {
          alert(cart);
        },
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

  // recuperar usuario de la sesión (guardado en login)
  const valorId = localStorage.getItem('idUsuario');
  const idUsuario = valorId ? Number(valorId) : null; //  conversión a número
alert("Usuario del login" +idUsuario);
  this.productService.comprar(productId, selectedQuantity, idUsuario).subscribe({
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


  






