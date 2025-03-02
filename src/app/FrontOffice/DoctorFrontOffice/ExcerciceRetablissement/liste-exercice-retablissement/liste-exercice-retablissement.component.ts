import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { ExerciceRetablissements } from 'src/core/models/ExerciceRetablissement';

@Component({
  selector: 'app-liste-exercice-retablissement',
  templateUrl: './liste-exercice-retablissement.component.html',
  styleUrls: ['./liste-exercice-retablissement.component.css'],
  standalone: false
})
export class ListeExerciceRetablissementComponent {


  exercices: ExerciceRetablissements[] = [];

  constructor(private exerciceService: ServiceDoctorService , private router:Router) {}
  ngOnInit(): void {
    this.getExercices();
  }

  getExercices(): void {
    this.exerciceService.getAllExercices().subscribe({
      next: (data) => {
        this.exercices = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des exercices :', err);
      }
    });
  }
  goToCreatePage(): void {
    this.router.navigate(['doctor/creationexerciceRetab']);
  }


  supprimerExercice(exercice: ExerciceRetablissements): void {
    if (confirm("Voulez-vous vraiment supprimer cet exercice ?")) {
      this.exerciceService.deletexercicebyid(exercice.idExerciceRetablissement).subscribe({
        next: () => {
          alert('Exercice supprimé avec succès !');
          this.getExercices(); // Mettre à jour la liste
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          alert('Erreur lors de la suppression de l’exercice.');
        }
      });
    }

  }}
