import { TestBed } from '@angular/core/testing';

import { ChoferguardService } from './choferguard.service';

describe('ChoferguardService', () => {
  let service: ChoferguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChoferguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
