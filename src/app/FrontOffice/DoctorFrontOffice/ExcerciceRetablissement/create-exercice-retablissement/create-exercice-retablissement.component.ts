import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { ExerciceRetablissements } from 'src/core/models/ExerciceRetablissement';

@Component({
  selector: 'app-create-exercice-retablissement',
  templateUrl: './create-exercice-retablissement.component.html',
  styleUrls: ['./create-exercice-retablissement.component.css']
})
export class CreateExerciceRetablissementComponent {

  exerciceForm: FormGroup;

  constructor(private fb: FormBuilder, private exerciceService: ServiceDoctorService ,  private router: Router) {
    this.exerciceForm = this.fb.group({
      nomExerciceRetablissement: ['', Validators.required],
      descriptionExerciceRetablissement: ['', Validators.required],
      dureeExercice: [null, [Validators.required, Validators.min(1)]], // Durée en minutes
      niveauDifficulte: ['', Validators.required]
    });
  }

  ajouterExercice(): void {
    if (this.exerciceForm.valid) {
      const exercice: ExerciceRetablissements = this.exerciceForm.value;
      this.exerciceService.addexercice(exercice).subscribe({
        next: () => {
          alert('Exercice ajouté avec succès !');
          this.exerciceForm.reset();
          this.router.navigate(['doctor/listeExercicedeRetablissement'])
          
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout :', err);
          alert('Erreur lors de l’ajout de l’exercice.');
        }
      });
    }
  }
  
  
}
