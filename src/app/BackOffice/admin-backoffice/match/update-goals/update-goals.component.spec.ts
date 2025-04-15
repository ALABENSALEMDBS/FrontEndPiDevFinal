import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGoalsComponent } from './update-goals.component';

describe('UpdateGoalsComponent', () => {
  let component: UpdateGoalsComponent;
  let fixture: ComponentFixture<UpdateGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGoalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
