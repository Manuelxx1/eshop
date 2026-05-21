import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { CartList} from './components/cart/cart';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { EstadoCompra } from './components/estado-compra/estado-compra';
import { Registrarse } from './components/registrarse/registrarse';
import { Dashboard } from './components/dashboard/dashboard';
import { Categoria } from './components/categoria/categoria';
import { Login } from './components/login/login';
import { Todoslosproductos } from './components/todoslosproductos/todoslosproductos';



export const routes: Routes = [{ path: '', component: ProductList},
  { path: 'cart', component: CartList},
 { path: 'forgot-password', component: ForgotPassword},
            { path: 'dashboard', component: Dashboard },
{path: 'login', component: Login },
 { path: 'estado-compra', component: EstadoCompra },
{ path: 'register', component: Registrarse },
//path dinámico que espera un parámetro 
{ path: 'categoria/:nombre', component: Categoria },
{path: 'productos', component: Todoslosproductos },
{path: 'productosdestacados', component: ProductList }               
];
