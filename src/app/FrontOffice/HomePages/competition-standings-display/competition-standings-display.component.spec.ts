import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionStandingsDisplayComponent } from './competition-standings-display.component';

describe('CompetitionStandingsDisplayComponent', () => {
  let component: CompetitionStandingsDisplayComponent;
  let fixture: ComponentFixture<CompetitionStandingsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionStandingsDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionStandingsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
