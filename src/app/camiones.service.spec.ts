import { TestBed } from '@angular/core/testing';

import { CamionesService } from './camiones.service';

describe('CamionesService', () => {
  let service: CamionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CamionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
