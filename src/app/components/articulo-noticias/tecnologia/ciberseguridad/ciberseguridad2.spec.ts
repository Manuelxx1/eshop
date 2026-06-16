import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiberSeguridad2 } from './ciberseguridad;
describe('CiberSeguridad2', () => {
  let component: CiberSeguridad2;
  let fixture: ComponentFixture<CiberSeguridad2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CiberSeguridad2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CiberSeguridad2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
