import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterCoachFrontComponent } from './footer-coach-front.component';

describe('FooterCoachFrontComponent', () => {
  let component: FooterCoachFrontComponent;
  let fixture: ComponentFixture<FooterCoachFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterCoachFrontComponent]
    });
    fixture = TestBed.createComponent(FooterCoachFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
