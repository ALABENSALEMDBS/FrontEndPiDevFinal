import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionStandingsComponentComponent } from './competition-standings-component.component';

describe('CompetitionStandingsComponentComponent', () => {
  let component: CompetitionStandingsComponentComponent;
  let fixture: ComponentFixture<CompetitionStandingsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionStandingsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionStandingsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
