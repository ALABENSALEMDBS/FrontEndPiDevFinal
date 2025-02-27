import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciceService } from 'src/app/services/serviceCoatch/serviceExercice/exercice.service';

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

  constructor(private seanceExercice: ExerciceService, private rout: Router) {
    // Initialisation manuelle du FormGroup
    this.exerciceform = new FormGroup({
      nameExercice: new FormControl('', [Validators.required, Validators.minLength(3)]),
      descriptionExercice: new FormControl('', [Validators.required]),
      videoExercice: new FormControl('', [
        Validators.required,
        Validators.pattern(/^https?:\/\/.*\.mp4$/) // Validation de l'URL de la vidéo (ex: https://exemple.com/nom.mp4)
      ]),
      photoExercice: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/) // Validation de l'URL de la photo (png, jpg, jpeg, gif)
      ])
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

  // Getters pour faciliter l'accès aux contrôles dans le template
  get nameExercice() {
    return this.exerciceform.get('nameExercice');
  }

  get descriptionExercice() {
    return this.exerciceform.get('descriptionExercice');
  }

  get videoExercice() {
    return this.exerciceform.get('videoExercice');
  }

  get photoExercice() {
    return this.exerciceform.get('photoExercice');
  }
}
