import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNourritureComponent } from './update-nourriture.component';

describe('UpdateNourritureComponent', () => {
  let component: UpdateNourritureComponent;
  let fixture: ComponentFixture<UpdateNourritureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateNourritureComponent]
    });
    fixture = TestBed.createComponent(UpdateNourritureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
