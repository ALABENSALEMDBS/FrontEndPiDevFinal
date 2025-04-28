import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupClubsComponent } from './cup-clubs.component';

describe('CupClubsComponent', () => {
  let component: CupClubsComponent;
  let fixture: ComponentFixture<CupClubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupClubsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CupClubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
