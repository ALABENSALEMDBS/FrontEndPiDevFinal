import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompetitionMatchComponent } from './update-competition-match.component';

describe('UpdateCompetitionMatchComponent', () => {
  let component: UpdateCompetitionMatchComponent;
  let fixture: ComponentFixture<UpdateCompetitionMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCompetitionMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCompetitionMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
