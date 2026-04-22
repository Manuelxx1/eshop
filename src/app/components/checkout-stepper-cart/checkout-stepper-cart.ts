import { Component,Input} from '@angular/core';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cart} from '../../services/cart';

@Component({
  selector: 'app-checkout-stepper-cart',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './checkout-stepper-cart.html',
  styleUrl: './checkout-stepper-cart.css',
})
export class CheckoutStepperCart {

  @Input() cart: any[] = [];
  currentStep = 1;
  showSummary = false; //  flag para mostrar resumen
initPointUrl: string | null = null;
  errorredir: string | null = null;
quantityControl = new FormControl<number>(1, { nonNullable: true });
products: any[] = [];
quantities: number[] = [1, 2, 3, 4, 5, 10]; // podés ajustar según el tipo de producto
  checkoutForm: FormGroup;
  //opciones de envío
  shippingOptions = [
  { id: 'standard', name: 'Envío estándar (3-5 días)', price: 5.99 },
  { id: 'express', name: 'Envío exprés (1-2 días)', price: 12.99 },
  { id: 'pickup', name: 'Retiro en tienda', price: 0.0 }
];
  constructor(private cartService: Cart,private fb: FormBuilder) {

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

  

  


  
  goNext() {
  this.currentStep++;
}



goBack() {
  if (this.currentStep > 1) {
    this.currentStep--;
    // Si vuelve al primer paso,para cambiar de producto reseteamos el envío
    //para qye el usuario pueda elegir la opcion que le conviene
    if (this.currentStep === 1) {
      this.checkoutForm.get('shippingOption')?.reset(null);
    }
  }
}

  //mostrar resumen de compra antes de confirmar compra 
mostrarResumen(): void {
    this.showSummary = true;
}
  
get subtotal(): number {
    return this.cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
}

  

comprarCarrito() {
    const idUsuario = Number(localStorage.getItem('idUsuario'));
    const cartItems = this.cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    const formData = this.checkoutForm.value;

    this.cartService.comprarCarrito(cartItems, idUsuario, formData).subscribe({
      next: initPoint => window.location.href = initPoint,
      error: err => console.error('Error en compra carrito', err)
    });
                                    }


}
