import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterDoctorFrontComponent } from './footer-doctor-front.component';

describe('FooterDoctorFrontComponent', () => {
  let component: FooterDoctorFrontComponent;
  let fixture: ComponentFixture<FooterDoctorFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterDoctorFrontComponent]
    });
    fixture = TestBed.createComponent(FooterDoctorFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
