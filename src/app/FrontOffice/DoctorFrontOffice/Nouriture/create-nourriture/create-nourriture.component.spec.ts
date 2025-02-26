import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNourritureComponent } from './create-nourriture.component';

describe('CreateNourritureComponent', () => {
  let component: CreateNourritureComponent;
  let fixture: ComponentFixture<CreateNourritureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNourritureComponent]
    });
    fixture = TestBed.createComponent(CreateNourritureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
