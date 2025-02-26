import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateexerciceComponent } from './updateexercice.component';

describe('UpdateexerciceComponent', () => {
  let component: UpdateexerciceComponent;
  let fixture: ComponentFixture<UpdateexerciceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateexerciceComponent]
    });
    fixture = TestBed.createComponent(UpdateexerciceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
