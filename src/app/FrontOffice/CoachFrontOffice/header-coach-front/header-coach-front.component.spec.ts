import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCoachFrontComponent } from './header-coach-front.component';

describe('HeaderCoachFrontComponent', () => {
  let component: HeaderCoachFrontComponent;
  let fixture: ComponentFixture<HeaderCoachFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderCoachFrontComponent]
    });
    fixture = TestBed.createComponent(HeaderCoachFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
