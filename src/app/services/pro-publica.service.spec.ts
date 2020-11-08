import { TestBed } from '@angular/core/testing';

import { ProPublicaService } from './pro-publica.service';

describe('ProPublicaService', () => {
  let service: ProPublicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProPublicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
