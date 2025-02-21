import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDoctorFrontComponent } from './header-doctor-front.component';

describe('HeaderDoctorFrontComponent', () => {
  let component: HeaderDoctorFrontComponent;
  let fixture: ComponentFixture<HeaderDoctorFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderDoctorFrontComponent]
    });
    fixture = TestBed.createComponent(HeaderDoctorFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
