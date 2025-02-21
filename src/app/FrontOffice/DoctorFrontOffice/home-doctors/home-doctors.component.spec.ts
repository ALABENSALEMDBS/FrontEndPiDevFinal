import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDoctorsComponent } from './home-doctors.component';

describe('HomeDoctorsComponent', () => {
  let component: HomeDoctorsComponent;
  let fixture: ComponentFixture<HomeDoctorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeDoctorsComponent]
    });
    fixture = TestBed.createComponent(HomeDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
