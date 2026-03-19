import { Component,OnInit } from '@angular/core';
import { Cart } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../services/cart'; // ajustá el path si hace falta
import { Dashboard } from '../dashboard/dashboard';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [CommonModule,Dashboard,ReactiveFormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartList implements OnInit{
  items: CartItem[] = [];
//items o productos del carrito para comprar 
  cart: any[] = [];
  total: number = 0;
  errorredir: string | null = null;

  checkoutForm: FormGroup;
  //opciones de envío
  shippingOptions = [
  { id: 'standard', name: 'Envío estándar (3-5 días)', price: 5.99 },
  { id: 'express', name: 'Envío exprés (1-2 días)', price: 12.99 },
  { id: 'pickup', name: 'Retiro en tienda', price: 0.0 }
];

      

  constructor(private cartService: Cart, private fb: FormBuilder) {
    //obtener datos personales para envío 
this.checkoutForm = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: [''],
  address: ['', Validators.required],
  city: ['', Validators.required],
  postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]],
  shippingOption: [null, Validators.required]   //  arranca en null
});
  }

  ngOnInit() {
/*versión localStorage 
  this.items = this.cartService.getItems();
  this.total = this.cartService.getTotal();
  */
    this.loadCart();
}




  //version backend 

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


  currentStep = 1;

goNext() {
  this.currentStep++;
}

goBack() {
  if (this.currentStep > 1) {
    this.currentStep--;
    if (this.currentStep === 1) {
      this.checkoutForm.get('shippingOption')?.reset(null);
    }
  }
}

comprarCarrito() {
  const valorId = localStorage.getItem('idUsuario');

  if (!valorId) {
    // Si no hay usuario logueado, podés redirigir al login o mostrar un error
    alert("Debes iniciar sesión para realizar la compra.");
    return;
  }

  const idUsuario = Number(valorId);

  const cartItems = this.items.map(item => ({
    productId: item.product.id,
    quantity: item.quantity
  }));

  const formData = this.checkoutForm.value;


  this.cartService.comprarCarrito(cartItems, idUsuario, formData).subscribe({
    next: initPoint => {
      window.location.href = initPoint;
    },
    error: err => {
      this.errorredir = JSON.stringify(err);
    }
  });
}

  


 getSubtotal(item: CartItem): number {
  return item.product.price * item.quantity;
}

  
  increase(productId: number): void {
  this.cartService.increaseFromCart(productId).subscribe({
    next: () => this.loadCart(),
    error: err => console.error('Error al aumentar cantidad', err)
  });
}

decrease(productId: number): void {
  this.cartService.decreaseFromCart(productId).subscribe({
    next: () => this.loadCart(),
    error: err => console.error('Error al disminuir cantidad', err)
  });
}

remove(cartItemId: number): void {
  this.cartService.removeFromCart(cartItemId).subscribe({
    next: () => this.loadCart(),
    error: err => console.error('Error al eliminar producto', err)
  });
}


  clear() {
    this.cartService.clearCart().subscribe(() => {
      this.loadCart();
    });
  }



}
