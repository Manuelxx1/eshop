import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { CartList} from './components/cart/cart';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ForgotUsername } from './components/forgot-username/forgot-username';
import { ResetPassword } from './components/reset-password/reset-password';
import { ResetUsername } from './components/reset-username/reset-username';
import { EstadoCompra } from './components/estado-compra/estado-compra';
import { Registrarse } from './components/registrarse/registrarse';
import { Dashboard } from './components/dashboard/dashboard';
import { ArticuloNoticias } from './components/articulo-noticias/articulo-noticias';
import { Categoria } from './components/categoria/categoria';
import { Login } from './components/login/login';
import { BackofficeCrudProducts } from './components/backoffice-crud-products/backoffice-crud-products';
import { Todoslosproductos } from './components/todoslosproductos/todoslosproductos';



export const routes: Routes = [{ path: '', component: ProductList},
  { path: 'cart', component: CartList},
 { path: 'forgot-password', component: ForgotPassword},      
                { path: 'forgot-username', component: ForgotUsername},
  { path: 'reset-password', component: ResetPassword },
                               { path: 'reset-username', component: ResetUsername },
            { path: 'dashboard', component: Dashboard },
{path: 'login', component: Login },
 { path: 'estado-compra', component: EstadoCompra },
{ path: 'register', component: Registrarse },
//path dinámico que espera un parámetro 
{ path: 'categoria/:nombre', component: Categoria },
{path: 'productos', component: Todoslosproductos },
{path: 'productosdestacados', component: ProductList },
      {path: 'backoffice-crud-products', component: BackofficeCrudProducts }    
                               {path: 'articulo-noticias', component: ArticuloNoticias },
];
