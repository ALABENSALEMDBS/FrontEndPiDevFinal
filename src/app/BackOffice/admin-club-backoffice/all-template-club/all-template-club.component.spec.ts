import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTemplateClubComponent } from './all-template-club.component';

describe('AllTemplateClubComponent', () => {
  let component: AllTemplateClubComponent;
  let fixture: ComponentFixture<AllTemplateClubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllTemplateClubComponent]
    });
    fixture = TestBed.createComponent(AllTemplateClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
