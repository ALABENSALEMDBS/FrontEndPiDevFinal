import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionMatchesDisplayComponent } from './competition-matches-display.component';

describe('CompetitionMatchesDisplayComponent', () => {
  let component: CompetitionMatchesDisplayComponent;
  let fixture: ComponentFixture<CompetitionMatchesDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionMatchesDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionMatchesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
