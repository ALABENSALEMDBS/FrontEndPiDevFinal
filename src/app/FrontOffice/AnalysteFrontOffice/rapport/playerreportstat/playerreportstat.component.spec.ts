import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerreportstatComponent } from './playerreportstat.component';

describe('PlayerreportstatComponent', () => {
  let component: PlayerreportstatComponent;
  let fixture: ComponentFixture<PlayerreportstatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerreportstatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerreportstatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
