import { TestBed } from '@angular/core/testing';

import { StatisindivService } from './statisindiv.service';

describe('StatisindivService', () => {
  let service: StatisindivService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisindivService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
