import { TestBed } from '@angular/core/testing';

import { CoatchService } from './coatch.service';

describe('CoatchService', () => {
  let service: CoatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
