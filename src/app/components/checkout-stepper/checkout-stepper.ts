import { Component,Input} from '@angular/core';
import { FormControl,ReactiveFormsModule, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product,Order} from '../../services/product';
import { Cart } from '../../services/cart';

@Component({
  selector: 'app-checkout-stepper',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './checkout-stepper.html',
  styleUrl: './checkout-stepper.css',
})
export class CheckoutStepper {
  @Input() selectedProduct: any;
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
  constructor(private productService: Product,public cartService: Cart,private fb: FormBuilder) {

      //obtener datos personales para envío 
this.checkoutForm = this.fb.group({
  name: ['', Validators.required],
  dni: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: [''],
  address: ['', Validators.required],
  city: ['', Validators.required],
  postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4,10}$/)]],
  shippingOption: [null, Validators.required]   //  arranca en null
});
  }

  

  selectProduct(product: any) {
  this.selectedProduct = product;
  this.currentStep = 2;
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


  // Compra directa → redirige al checkout
buyNow(productId: number): void {
  alert("Botón comprar clickeado ");
  alert("productId del frontend" + productId);
  const dni =this.checkoutForm.value.dni;
    alert(" número de dni"+ dni);
  const selectedQuantity = this.quantityControl.value ?? 1;
  console.log('Cantidad seleccionada:', selectedQuantity);
//const shippingOption = this.shippingControl.value;
  const formData = this.checkoutForm.value;
  
  console.log('Datos del comprador:', formData);
  // recuperar usuario de la sesión (guardado en login)
  const valorId = localStorage.getItem('idUsuario');
  const idUsuario = valorId ? Number(valorId) : null; //  conversión a número
alert("Usuario del login" +idUsuario);
  this.productService.comprar(productId, selectedQuantity, idUsuario,formData).subscribe({
    next: initPoint => {
      alert("initPoint recibido: " + initPoint);
      localStorage.setItem('selectedProduct', JSON.stringify(productId));

      // redirige al checkout de Mercado Pago
      window.location.href = initPoint;
      this.productService.clearPendingCheckout();
    },
    error: err => {
      alert("Error al llamar al backend: " + JSON.stringify(err));
      this.errorredir = JSON.stringify(err);
    }
  });
}


  increase() {
  const current = this.quantityControl.value || 1;
  this.quantityControl.setValue(current + 1);
}

decrease() {
  const current = this.quantityControl.value || 1;
  if (current > 1) {
    this.quantityControl.setValue(current - 1);
  }
  }



}
