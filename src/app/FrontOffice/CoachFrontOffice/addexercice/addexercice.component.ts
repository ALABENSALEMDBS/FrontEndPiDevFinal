import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciceService } from 'src/app/services/serviceCoatch/serviceExercice/exercice.service';

export enum ExerciseType {
  CARDIO = 'CARDIO',
  STRETCHING = 'STRETCHING',
  MOBILITY = 'MOBILITY',
  BREATHING = 'BREATHING',
  DRIBBLE = 'DRIBBLE',
  LIGHT_ENDURANCE = 'LIGHT_ENDURANCE',
  COORDINATION = 'COORDINATION',
  HEADSHOT = 'HEADSHOT',
  AGILITY = 'AGILITY',
  REACTIVITY = 'REACTIVITY',
  PASSING = 'PASSING',
  ENDURANCE = 'ENDURANCE',
  STRENGTH = 'STRENGTH',
  TACTICAL = 'TACTICAL',
  POWER = 'POWER',
  EXPLOSIVENESS = 'EXPLOSIVENESS',
  SPEED = 'SPEED',
  HIGH_SPEED = 'HIGH_SPEED',
  HIGH_INTENSITY = 'HIGH_INTENSITY',
  ANAEROBIC = 'ANAEROBIC',
  SPRINTS = 'SPRINTS',
  RESISTANCE = 'RESISTANCE'
}

@Component({
  selector: 'app-addexercice',
  templateUrl: './addexercice.component.html',
  styleUrls: ['./addexercice.component.css'],
  standalone: false
})
export class AddexerciceComponent {
  exerciceform: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  exerciseTypes = Object.values(ExerciseType);

  constructor(private seanceExercice: ExerciceService, private rout: Router) {
    this.exerciceform = new FormGroup({
      nameExercice: new FormControl('', [Validators.required, Validators.minLength(3)]),
      descriptionExercice: new FormControl('', [Validators.required]),
      videoExercice: new FormControl('', [Validators.required]),
      typeExercice: new FormControl('', [Validators.required]) // <<<<<< ici je corrige
    });
  }

  addExercice() {
    if (this.exerciceform.valid) {
      this.seanceExercice.addExercices(this.exerciceform.value).subscribe({
        next: () => {
          this.successMessage = 'Exercice ajouté avec succès !';
          this.errorMessage = '';
          this.exerciceform.reset();
          window.location.reload();
        },
        error: () => {
          this.errorMessage = 'Erreur lors de l’ajout de l’exercice.';
          this.successMessage = '';
        }
      });
    }
  }

  get nameExercice() {
    return this.exerciceform.get('nameExercice');
  }
  get descriptionExercice() {
    return this.exerciceform.get('descriptionExercice');
  }
  get videoExercice() {
    return this.exerciceform.get('videoExercice');
  }
  get typeExercice() { // <<<< ici aussi correction
    return this.exerciceform.get('typeExercice');
  }

  avoidAdd() {
    this.rout.navigate(['/coatch/showexercice']);
  }
}
