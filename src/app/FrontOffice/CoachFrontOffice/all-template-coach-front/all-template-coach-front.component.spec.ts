import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTemplateCoachFrontComponent } from './all-template-coach-front.component';

describe('AllTemplateCoachFrontComponent', () => {
  let component: AllTemplateCoachFrontComponent;
  let fixture: ComponentFixture<AllTemplateCoachFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllTemplateCoachFrontComponent]
    });
    fixture = TestBed.createComponent(AllTemplateCoachFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
