import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateformationComponent } from './updateformation.component';

describe('UpdateformationComponent', () => {
  let component: UpdateformationComponent;
  let fixture: ComponentFixture<UpdateformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateformationComponent]
    });
    fixture = TestBed.createComponent(UpdateformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
