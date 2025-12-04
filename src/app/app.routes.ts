import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { CartList} from './components/cart/cart';
import { Checkout} from './components/checkout/checkout';
export const routes: Routes = [{ path: '', component: ProductList},
  { path: 'cart', component: CartList},
     { path: 'test-checkout', component: Checkout },
                          
{ path: 'comprar', component: Checkout },
{ path: 'registrarse', component: ProductList }
];
