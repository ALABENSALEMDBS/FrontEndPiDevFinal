import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateseanceComponent } from './updateseance.component';

describe('UpdateseanceComponent', () => {
  let component: UpdateseanceComponent;
  let fixture: ComponentFixture<UpdateseanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateseanceComponent]
    });
    fixture = TestBed.createComponent(UpdateseanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
