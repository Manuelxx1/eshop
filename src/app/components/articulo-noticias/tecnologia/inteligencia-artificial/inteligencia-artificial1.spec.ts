import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteligenciaArtificial1 } from './inteligencia-artificial;
describe('InteligenciaArtificial1', () => {
  let component: InteligenciaArtificial1;
  let fixture: ComponentFixture<InteligenciaArtificial1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteligenciaArtificial1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteligenciaArtificial1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
