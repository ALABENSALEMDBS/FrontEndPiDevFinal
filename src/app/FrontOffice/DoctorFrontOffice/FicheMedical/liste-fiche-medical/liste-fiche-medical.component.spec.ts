import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeFicheMedicalComponent } from './liste-fiche-medical.component';

describe('ListeFicheMedicalComponent', () => {
  let component: ListeFicheMedicalComponent;
  let fixture: ComponentFixture<ListeFicheMedicalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeFicheMedicalComponent]
    });
    fixture = TestBed.createComponent(ListeFicheMedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
