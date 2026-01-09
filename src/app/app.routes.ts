import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { CartList} from './components/cart/cart';
import { Checkout} from './components/checkout/checkout';
import { CompraExitosa } from './components/compra-exitosa/compra-exitosa';
import { Registrarse } from './components/registrarse/registrarse';
export const routes: Routes = [{ path: '', component: ProductList},
  { path: 'cart', component: CartList},
     { path: 'test-checkout', component: Checkout },
                          
{ path: 'comprar', component: Checkout },
 { path: 'compra-exitosa', component: CompraExitosa },
{ path: 'registrarse', component: Registrarse }
];
