import { ComponentFixture, TestBed } from '@angular/core/testing';

import { todoslosproductos } from './todoslosproductos';

describe('todoslosproductos', () => {
  let component: todoslosproductos;
  let fixture: ComponentFixture<todoslosproductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [todoslosproductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(todoslosproductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
