import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTournoiComponent } from './update-tournoi.component';

describe('UpdateTournoiComponent', () => {
  let component: UpdateTournoiComponent;
  let fixture: ComponentFixture<UpdateTournoiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTournoiComponent]
    });
    fixture = TestBed.createComponent(UpdateTournoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
