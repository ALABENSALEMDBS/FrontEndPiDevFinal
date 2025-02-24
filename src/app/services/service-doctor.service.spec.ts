import { TestBed } from '@angular/core/testing';

import { ServiceDoctorService } from './service-doctor.service';

describe('ServiceDoctorService', () => {
  let service: ServiceDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
