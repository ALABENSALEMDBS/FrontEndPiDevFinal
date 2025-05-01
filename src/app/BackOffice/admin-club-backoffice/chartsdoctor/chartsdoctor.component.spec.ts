import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsdoctorComponent } from './chartsdoctor.component';

describe('ChartsdoctorComponent', () => {
  let component: ChartsdoctorComponent;
  let fixture: ComponentFixture<ChartsdoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsdoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartsdoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
