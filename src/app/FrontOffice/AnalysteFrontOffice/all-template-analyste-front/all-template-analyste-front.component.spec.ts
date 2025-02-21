import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTemplateAnalysteFrontComponent } from './all-template-analyste-front.component';

describe('AllTemplateAnalysteFrontComponent', () => {
  let component: AllTemplateAnalysteFrontComponent;
  let fixture: ComponentFixture<AllTemplateAnalysteFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllTemplateAnalysteFrontComponent]
    });
    fixture = TestBed.createComponent(AllTemplateAnalysteFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
