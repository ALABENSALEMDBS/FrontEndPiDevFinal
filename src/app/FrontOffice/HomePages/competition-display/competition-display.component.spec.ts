import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionDisplayComponent } from './competition-display.component';

describe('CompetitionDisplayComponent', () => {
  let component: CompetitionDisplayComponent;
  let fixture: ComponentFixture<CompetitionDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
