import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTacticComponent } from './list-tactic.component';

describe('ListTacticComponent', () => {
  let component: ListTacticComponent;
  let fixture: ComponentFixture<ListTacticComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTacticComponent]
    });
    fixture = TestBed.createComponent(ListTacticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
