import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { CartList} from './components/cart/cart';
export const routes: Routes = [{ path: '', component: ProductList},
  { path: 'cart', component: CartList}];
