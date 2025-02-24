import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { ExerciceRetablissements } from 'src/core/models/ExerciceRetablissement';

@Component({
  selector: 'app-update-exercice-retablissement',
  templateUrl: './update-exercice-retablissement.component.html',
  styleUrls: ['./update-exercice-retablissement.component.css']
})
export class UpdateExerciceRetablissementComponent {
  exerciceForm: FormGroup;
  idExerciceRetablissement!: number; // Utiliser l'opérateur "!" pour indiquer que cette valeur sera assignée plus tard

  constructor(
    private fb: FormBuilder,
    private exerciceService: ServiceDoctorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.exerciceForm = this.fb.group({
      nomExerciceRetablissement: ['', Validators.required],
      descriptionExerciceRetablissement: ['', Validators.required],
      dureeExercice: [null, [Validators.required, Validators.min(1)]], // Durée en minutes
      niveauDifficulte: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Récupérer l'id de l'exercice à partir de l'URL
    this.idExerciceRetablissement = +this.route.snapshot.paramMap.get('id')!;  // Conversion en nombre
    this.loadExercice();
  }
  
  loadExercice(): void {
    // Vérification que la méthode 'getExerciceById' existe dans le service
    this.exerciceService.getExerciceById(this.idExerciceRetablissement).subscribe({
      next: (exercice) => {
        if (exercice) {
          // Remplir le formulaire avec les données récupérées
          this.exerciceForm.patchValue(exercice);
        } else {
          alert('Exercice non trouvé.');
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l’exercice :', err);
        alert('Erreur lors du chargement de l’exercice.');
      }
    });
  }
  
  updateExercice(): void {
    if (this.exerciceForm.valid) {
      const exercice: ExerciceRetablissements = { 
        ...this.exerciceForm.value,
        idExerciceRetablissement: this.idExerciceRetablissement // Inclure l'ID dans l'objet
      };
      
      this.exerciceService.updateExercice(this.idExerciceRetablissement.toString(), exercice).subscribe({
        next: () => {
          alert('Exercice mis à jour avec succès !');
          this.router.navigate(['/doctor/listeExercicedeRetablissement']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour :', err);
          alert('Erreur lors de la mise à jour de l’exercice. Détails : ' + err.message || 'Erreur inconnue');
        }
      });
    }
}

}
