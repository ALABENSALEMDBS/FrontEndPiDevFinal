import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateticComponent } from './statetic.component';

describe('StateticComponent', () => {
  let component: StateticComponent;
  let fixture: ComponentFixture<StateticComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateticComponent]
    });
    fixture = TestBed.createComponent(StateticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
