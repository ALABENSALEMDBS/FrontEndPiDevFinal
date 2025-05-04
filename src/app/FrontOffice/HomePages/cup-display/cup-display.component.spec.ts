import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupDisplayComponent } from './cup-display.component';

describe('CupDisplayComponent', () => {
  let component: CupDisplayComponent;
  let fixture: ComponentFixture<CupDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
