import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutStepperCart } from './checkout-stepper-cart';

describe('CheckoutStepperCart', () => {
  let component: CheckoutStepperCart;
  let fixture: ComponentFixture<CheckoutStepperCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutStepperCart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutStepperCart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
