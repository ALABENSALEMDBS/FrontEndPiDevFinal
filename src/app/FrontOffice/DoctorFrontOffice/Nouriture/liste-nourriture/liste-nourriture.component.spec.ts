import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeNourritureComponent } from './liste-nourriture.component';

describe('ListeNourritureComponent', () => {
  let component: ListeNourritureComponent;
  let fixture: ComponentFixture<ListeNourritureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeNourritureComponent]
    });
    fixture = TestBed.createComponent(ListeNourritureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
