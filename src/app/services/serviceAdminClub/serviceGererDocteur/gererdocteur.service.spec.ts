import { TestBed } from '@angular/core/testing';

import { GererdocteurService } from './gererdocteur.service';

describe('GererdocteurService', () => {
  let service: GererdocteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GererdocteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
