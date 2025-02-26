import { TestBed } from '@angular/core/testing';

import { SousgroupeService } from './sousgroupe.service';

describe('SousgroupeService', () => {
  let service: SousgroupeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SousgroupeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
