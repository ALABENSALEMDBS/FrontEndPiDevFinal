import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExerciceRetablissementComponent } from './create-exercice-retablissement.component';

describe('CreateExerciceRetablissementComponent', () => {
  let component: CreateExerciceRetablissementComponent;
  let fixture: ComponentFixture<CreateExerciceRetablissementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateExerciceRetablissementComponent]
    });
    fixture = TestBed.createComponent(CreateExerciceRetablissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
