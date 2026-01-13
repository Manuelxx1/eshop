import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { CartList} from './components/cart/cart';
import { Checkout} from './components/checkout/checkout';
import { EstadoCompra } from './components/compra-exitosa/compra-exitosa';
import { Registrarse } from './components/registrarse/registrarse';
export const routes: Routes = [{ path: '', component: ProductList},
  { path: 'cart', component: CartList},
     { path: 'test-checkout', component: Checkout },
                          
{ path: 'comprar', component: Checkout },
 { path: 'estado-compra', component: EstadoCompra },
{ path: 'registrarse', component: Registrarse }
];
