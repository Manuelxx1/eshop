import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { CartList} from './components/cart/cart';
import { Checkout} from './components/checkout/checkout';
import { EstadoCompra } from './components/estado-compra/estado-compra';
import { Registrarse } from './components/registrarse/registrarse';
import { Dashboard } from './components/dashboard/dashboard';
import { Categoria } from './components/categoria/categoria';
import { Login } from './components/login/login';
import { Todoslosproductos } from './components/todoslosproductos/todoslosproductos';

export const routes: Routes = [{ path: '', component: ProductList},
  { path: 'cart', component: CartList},
     { path: 'test-checkout', component: Checkout },
            { path: 'dashboard', component: Dashboard },
{path: 'login', component: Login },
{ path: 'comprar', component: Checkout },
 { path: 'estado-compra', component: EstadoCompra },
{ path: 'register', component: Registrarse },
//path dinámico que espera un parámetro 
{ path: 'categoria/:nombre', component: Categoria },
{path: 'productos', component: Todoslosproductos },
];
