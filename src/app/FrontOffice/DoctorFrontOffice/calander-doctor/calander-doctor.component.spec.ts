import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalanderDoctorComponent } from './calander-doctor.component';

describe('CalanderDoctorComponent', () => {
  let component: CalanderDoctorComponent;
  let fixture: ComponentFixture<CalanderDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalanderDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalanderDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
