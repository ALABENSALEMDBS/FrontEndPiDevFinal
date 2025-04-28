import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupBracketComponent } from './cup-bracket.component';

describe('CupBracketComponent', () => {
  let component: CupBracketComponent;
  let fixture: ComponentFixture<CupBracketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupBracketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
