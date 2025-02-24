import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateFicheMedicalComponent } from './create-update-fiche-medical.component';

describe('CreateUpdateFicheMedicalComponent', () => {
  let component: CreateUpdateFicheMedicalComponent;
  let fixture: ComponentFixture<CreateUpdateFicheMedicalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateFicheMedicalComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateFicheMedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
