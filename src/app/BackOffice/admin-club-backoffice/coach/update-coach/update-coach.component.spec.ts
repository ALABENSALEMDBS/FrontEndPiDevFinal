import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCoachComponent } from './update-coach.component';

describe('UpdateCoachComponent', () => {
  let component: UpdateCoachComponent;
  let fixture: ComponentFixture<UpdateCoachComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCoachComponent]
    });
    fixture = TestBed.createComponent(UpdateCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
