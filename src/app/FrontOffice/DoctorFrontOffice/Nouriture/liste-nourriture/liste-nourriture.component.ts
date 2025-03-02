import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { Nouriture } from 'src/core/models/nouriture';

@Component({
  selector: 'app-liste-nourriture',
  templateUrl: './liste-nourriture.component.html',
  styleUrls: ['./liste-nourriture.component.css'],
  standalone: false
})
export class ListeNourritureComponent {

  nourritureForm: FormGroup;
  nourritures: Nouriture[] = [];
  message: string = '';

  constructor(private fb: FormBuilder, private nouritureService: ServiceDoctorService, private router: Router ) {
    this.nourritureForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      recommandation: ['', [Validators.required, Validators.minLength(5)]],
      calories: [null, [Validators.required, Validators.min(0)]]
    });
  }
  goToCreatePage(): void {
    this.router.navigate(['doctor/createnouriture']);
  }
  ngOnInit(): void {
    this.chargerNourritures();
  }

  chargerNourritures() {
    this.nouritureService.getAllNouriture().subscribe({
      next: (data) => {
        this.nourritures = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des nourritures', err);
      }
    });
  }

  onUpdateNouritureClicked(fm: Nouriture): void {
    console.log("Bouton Edit cliqué !", fm);
    this.router.navigate(['doctor/updatenouriture'], { queryParams: { id: fm.idNourriture } });
  }

  supprimerNourriture(nourriture: Nouriture): void {
 if (confirm("Do you really want to delete this food?")) {
      this.nouritureService.deletNouriturebyid(nourriture.idNourriture).subscribe({
        next: () => {
         // alert('Nourriture supprimée avec succès !');
          this.chargerNourritures(); // Mettre à jour la liste
         // this.router.navigate(['doctor/updatenouriture'])
        },
        // error: (err) => {
        //   console.error('Erreur lors de la suppression :', err);
        //   alert('Erreur lors de la suppression de la nourriture.');
        // }
      });
    }
    }}
