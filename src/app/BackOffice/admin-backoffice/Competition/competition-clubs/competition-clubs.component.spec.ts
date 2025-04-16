import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionClubsComponent } from './competition-clubs.component';

describe('CompetitionClubsComponent', () => {
  let component: CompetitionClubsComponent;
  let fixture: ComponentFixture<CompetitionClubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionClubsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionClubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
