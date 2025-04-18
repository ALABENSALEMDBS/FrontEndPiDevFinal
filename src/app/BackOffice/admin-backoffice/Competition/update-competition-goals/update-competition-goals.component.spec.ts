import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompetitionGoalsComponent } from './update-competition-goals.component';

describe('UpdateCompetitionGoalsComponent', () => {
  let component: UpdateCompetitionGoalsComponent;
  let fixture: ComponentFixture<UpdateCompetitionGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCompetitionGoalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCompetitionGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
