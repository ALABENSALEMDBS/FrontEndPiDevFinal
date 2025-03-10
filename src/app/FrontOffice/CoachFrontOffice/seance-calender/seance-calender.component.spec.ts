import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeanceCalenderComponent } from './seance-calender.component';

describe('SeanceCalenderComponent', () => {
  let component: SeanceCalenderComponent;
  let fixture: ComponentFixture<SeanceCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeanceCalenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeanceCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
