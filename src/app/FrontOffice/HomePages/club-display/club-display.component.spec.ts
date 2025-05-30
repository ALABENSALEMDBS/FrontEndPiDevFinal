import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubDisplayComponent } from './club-display.component';

describe('ClubDisplayComponent', () => {
  let component: ClubDisplayComponent;
  let fixture: ComponentFixture<ClubDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
