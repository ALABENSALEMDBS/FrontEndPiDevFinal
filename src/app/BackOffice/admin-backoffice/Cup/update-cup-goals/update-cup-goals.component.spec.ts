import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCupGoalsComponent } from './update-cup-goals.component';

describe('UpdateCupGoalsComponent', () => {
  let component: UpdateCupGoalsComponent;
  let fixture: ComponentFixture<UpdateCupGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCupGoalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCupGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
