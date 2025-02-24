import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTournoiComponent } from './add-tournoi.component';

describe('AddTournoiComponent', () => {
  let component: AddTournoiComponent;
  let fixture: ComponentFixture<AddTournoiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTournoiComponent]
    });
    fixture = TestBed.createComponent(AddTournoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
