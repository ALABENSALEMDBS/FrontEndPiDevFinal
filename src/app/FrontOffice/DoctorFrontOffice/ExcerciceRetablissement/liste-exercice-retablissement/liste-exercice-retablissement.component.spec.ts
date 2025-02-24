import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeExerciceRetablissementComponent } from './liste-exercice-retablissement.component';

describe('ListeExerciceRetablissementComponent', () => {
  let component: ListeExerciceRetablissementComponent;
  let fixture: ComponentFixture<ListeExerciceRetablissementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeExerciceRetablissementComponent]
    });
    fixture = TestBed.createComponent(ListeExerciceRetablissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
