import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraExitosa } from './compra-exitosa';

describe('CompraExitosa', () => {
  let component: CompraExitosa;
  let fixture: ComponentFixture<CompraExitosa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraExitosa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraExitosa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
