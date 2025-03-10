import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerRapportDetailsComponent } from './player-rapport-details.component';

describe('PlayerRapportDetailsComponent', () => {
  let component: PlayerRapportDetailsComponent;
  let fixture: ComponentFixture<PlayerRapportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerRapportDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerRapportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
