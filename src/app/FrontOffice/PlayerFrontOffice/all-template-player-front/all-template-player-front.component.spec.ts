import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTemplatePlayerFrontComponent } from './all-template-player-front.component';

describe('AllTemplatePlayerFrontComponent', () => {
  let component: AllTemplatePlayerFrontComponent;
  let fixture: ComponentFixture<AllTemplatePlayerFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllTemplatePlayerFrontComponent]
    });
    fixture = TestBed.createComponent(AllTemplatePlayerFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
