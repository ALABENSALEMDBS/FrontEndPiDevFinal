import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupBracketDisplayComponent } from './cup-bracket-display.component';

describe('CupBracketDisplayComponent', () => {
  let component: CupBracketDisplayComponent;
  let fixture: ComponentFixture<CupBracketDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupBracketDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupBracketDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
