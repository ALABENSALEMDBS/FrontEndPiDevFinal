import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersFormationComponent } from './players-formation.component';

describe('PlayersFormationComponent', () => {
  let component: PlayersFormationComponent;
  let fixture: ComponentFixture<PlayersFormationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersFormationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayersFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
