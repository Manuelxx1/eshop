import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloNoticias } from './articulo-noticias';

describe('ArticuloNoticias', () => {
  let component: ArticuloNoticias;
  let fixture: ComponentFixture<ArticuloNoticias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticuloNoticias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticuloNoticias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
