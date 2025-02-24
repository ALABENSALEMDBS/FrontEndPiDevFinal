import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateExerciceRetablissementComponent } from './update-exercice-retablissement.component';

describe('UpdateExerciceRetablissementComponent', () => {
  let component: UpdateExerciceRetablissementComponent;
  let fixture: ComponentFixture<UpdateExerciceRetablissementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateExerciceRetablissementComponent]
    });
    fixture = TestBed.createComponent(UpdateExerciceRetablissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
