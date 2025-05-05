import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionClubsDisplayComponent } from './competition-clubs-display.component';

describe('CompetitionClubsDisplayComponent', () => {
  let component: CompetitionClubsDisplayComponent;
  let fixture: ComponentFixture<CompetitionClubsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionClubsDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionClubsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
