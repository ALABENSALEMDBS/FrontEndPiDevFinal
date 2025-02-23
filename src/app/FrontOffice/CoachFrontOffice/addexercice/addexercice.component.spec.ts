import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddexerciceComponent } from './addexercice.component';

describe('AddexerciceComponent', () => {
  let component: AddexerciceComponent;
  let fixture: ComponentFixture<AddexerciceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddexerciceComponent]
    });
    fixture = TestBed.createComponent(AddexerciceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
