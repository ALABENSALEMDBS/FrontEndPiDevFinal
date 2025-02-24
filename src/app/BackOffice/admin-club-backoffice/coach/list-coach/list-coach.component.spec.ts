import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCoachComponent } from './list-coach.component';

describe('ListCoachComponent', () => {
  let component: ListCoachComponent;
  let fixture: ComponentFixture<ListCoachComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCoachComponent]
    });
    fixture = TestBed.createComponent(ListCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
