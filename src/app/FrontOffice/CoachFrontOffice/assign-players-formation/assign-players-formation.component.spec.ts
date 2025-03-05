import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPlayersFormationComponent } from './assign-players-formation.component';

describe('AssignPlayersFormationComponent', () => {
  let component: AssignPlayersFormationComponent;
  let fixture: ComponentFixture<AssignPlayersFormationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignPlayersFormationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignPlayersFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
