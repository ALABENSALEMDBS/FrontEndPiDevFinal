import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupMatchesComponent } from './cup-matches.component';

describe('CupMatchesComponent', () => {
  let component: CupMatchesComponent;
  let fixture: ComponentFixture<CupMatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupMatchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
