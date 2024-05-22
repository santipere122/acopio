import { TestBed } from '@angular/core/testing';

import { AcopioService } from './acopio.service';

describe('AcopioService', () => {
  let service: AcopioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcopioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
