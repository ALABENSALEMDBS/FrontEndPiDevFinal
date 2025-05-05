import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupMatchesDisplayComponent } from './cup-matches-display.component';

describe('CupMatchesDisplayComponent', () => {
  let component: CupMatchesDisplayComponent;
  let fixture: ComponentFixture<CupMatchesDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupMatchesDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupMatchesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
