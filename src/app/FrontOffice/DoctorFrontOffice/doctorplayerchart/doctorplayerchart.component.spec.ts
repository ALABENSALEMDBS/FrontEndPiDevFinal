import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorplayerchartComponent } from './doctorplayerchart.component';

describe('DoctorplayerchartComponent', () => {
  let component: DoctorplayerchartComponent;
  let fixture: ComponentFixture<DoctorplayerchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorplayerchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorplayerchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
