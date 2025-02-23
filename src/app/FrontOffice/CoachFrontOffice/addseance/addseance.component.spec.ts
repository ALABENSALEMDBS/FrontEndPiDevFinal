import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddseanceComponent } from './addseance.component';

describe('AddseanceComponent', () => {
  let component: AddseanceComponent;
  let fixture: ComponentFixture<AddseanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddseanceComponent]
    });
    fixture = TestBed.createComponent(AddseanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
