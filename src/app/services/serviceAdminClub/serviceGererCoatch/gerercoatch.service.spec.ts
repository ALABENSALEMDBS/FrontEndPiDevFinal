import { TestBed } from '@angular/core/testing';

import { GerercoatchService } from './gerercoatch.service';

describe('GerercoatchService', () => {
  let service: GerercoatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GerercoatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
