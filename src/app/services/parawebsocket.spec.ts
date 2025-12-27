import { TestBed } from '@angular/core/testing';

import { Parawebsocket } from './parawebsocket';

describe('Parawebsocket', () => {
  let service: Parawebsocket;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Parawebsocket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
