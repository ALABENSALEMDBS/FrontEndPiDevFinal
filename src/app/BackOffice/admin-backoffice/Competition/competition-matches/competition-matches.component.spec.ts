import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionMatchesComponent } from './competition-matches.component';

describe('CompetitionMatchesComponent', () => {
  let component: CompetitionMatchesComponent;
  let fixture: ComponentFixture<CompetitionMatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionMatchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
