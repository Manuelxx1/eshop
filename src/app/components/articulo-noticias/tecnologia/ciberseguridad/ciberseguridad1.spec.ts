import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiberSeguridad1 } from './ciberseguridad;
describe('CiberSeguridad1', () => {
  let component: CiberSeguridad1;
  let fixture: ComponentFixture<CiberSeguridad1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CiberSeguridad1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CiberSeguridad1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
