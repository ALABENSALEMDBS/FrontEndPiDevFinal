import { query } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { FicheMedical } from 'src/core/models/ficheMedical';

@Component({
  selector: 'app-liste-fiche-medical',
  templateUrl: './liste-fiche-medical.component.html',
  styleUrls: ['./liste-fiche-medical.component.css']
})
export class ListeFicheMedicalComponent {
  fichesMedicales: any[] = [];
  errorMessage = '';

  constructor(private servicedoctors: ServiceDoctorService , private router :Router) {}

  ngOnInit(): void {
    this.loadFichesMedicales();
  }

  loadFichesMedicales(): void {
    this.servicedoctors.getFichesMedicales().subscribe({
      next: (data) => this.fichesMedicales = data,
      error: (err) => this.errorMessage = 'Erreur de chargement des données.'
    });
  }

  onUpdateFicheMedicaleClicked(fm: FicheMedical): void {
    this.router.navigate(['doctor/update-fiche-player'], { queryParams: { id: fm.idFicheMedicale } })
  }

   supprimerficheMedical(fiche: FicheMedical): void {
      if (confirm("Voulez-vous vraiment supprimer cet exercice ?")) {
        this.servicedoctors.deletfichemedicalbyid(fiche.idFicheMedicale).subscribe({
          next: () => {
            alert('Exercice supprimé avec succès !');
            this.loadFichesMedicales(); // Mettre à jour la liste
          },
          error: (err) => {
            console.error('Erreur lors de la suppression :', err);
            alert('Erreur lors de la suppression de l’exercice.');
          }
        });
      }
    }}
