import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupClubsDisplayComponent } from './cup-clubs-display.component';

describe('CupClubsDisplayComponent', () => {
  let component: CupClubsDisplayComponent;
  let fixture: ComponentFixture<CupClubsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupClubsDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupClubsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
