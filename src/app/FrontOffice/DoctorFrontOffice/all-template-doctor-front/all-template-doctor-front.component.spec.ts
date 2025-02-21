import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTemplateDoctorFrontComponent } from './all-template-doctor-front.component';

describe('AllTemplateDoctorFrontComponent', () => {
  let component: AllTemplateDoctorFrontComponent;
  let fixture: ComponentFixture<AllTemplateDoctorFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllTemplateDoctorFrontComponent]
    });
    fixture = TestBed.createComponent(AllTemplateDoctorFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
