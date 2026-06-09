import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeCrudProducts } from './backoffice-crud-products';

describe('BackofficeCrudProducts', () => {
  let component: BackofficeCrudProducts;
  let fixture: ComponentFixture<BackofficeCrudProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackofficeCrudProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackofficeCrudProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
