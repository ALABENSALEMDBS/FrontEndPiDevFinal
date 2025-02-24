import { TestBed } from '@angular/core/testing';

import { GereranalysteService } from './gereranalyste.service';

describe('GereranalysteService', () => {
  let service: GereranalysteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GereranalysteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
