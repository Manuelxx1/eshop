import { Component,HostListener,OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product,Order} from '../../services/product';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cart } from '../../services/cart';

  interface Actividad {
  id?: string;              // opcional, sirve para evitar duplicados
  fecha: Date | string;     // puede venir como Date o string del backend
  tipo: string;
  descripcion: string;
  }

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})



export class Dashboard implements OnInit,OnDestroy {

  sesionActivaSinGoogle = false;
  datosdesesion: string = "";
private timeoutId: any;
  private warningId: any;
  private tiempoInactividad = 5 * 60 * 1000; // 5 minutos
  private tiempoAdvertencia = 1 * 60 * 1000; // 1 minuto antes
 mostrarAdvertencia = false;
  
  orders: Order[] = [];
  

    
//dashboard de usuario 
  estadisticas: any = {};
actividad: Actividad[] = [];
  email: any ;
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
  
  conexionActiva = false;
  
    menuOpen: boolean = false;
  

  constructor(private productService: Product,private cartService: Cart,private router: Router,private fb: FormBuilder) {
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
    this.session();
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
        
        this.sesionActivaSinGoogle = false;
this.datosdesesion ="";
        this.mensajedecambiopassword=null;
    this.mensajedecambiousername=null;

        ;
        //Limpiamos todos los items del carrito del localStorage y los subjects 
        //al cerrar session asi cuando volvemos 
        //a iniciar sesión y se realiza la migración
        //al no haber items no se duplican los datos en la base
      this.cartService.clearLocal()
        this.router.navigate(['/']);   // Redirige al login o donde prefieras
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
  



}
