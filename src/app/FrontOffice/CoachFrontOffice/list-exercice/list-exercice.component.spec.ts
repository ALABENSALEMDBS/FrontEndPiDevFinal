import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExerciceComponent } from './list-exercice.component';

describe('ListExerciceComponent', () => {
  let component: ListExerciceComponent;
  let fixture: ComponentFixture<ListExerciceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListExerciceComponent]
    });
    fixture = TestBed.createComponent(ListExerciceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
