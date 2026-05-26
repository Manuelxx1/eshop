import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetUsername } from './reset-username';

describe('ResetUsername', () => {
  let component: ResetUsername;
  let fixture: ComponentFixture<ResetUsername>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetUsername]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetUsername);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
